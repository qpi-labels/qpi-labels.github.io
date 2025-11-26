import sys
import socket
import threading
import subprocess
import ctypes
import time
import winreg

# PyQt5 자동 설치 및 임포트
try:
    from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                                  QPushButton, QLabel, QTextEdit, QGraphicsDropShadowEffect, QFrame)
    from PyQt5.QtCore import Qt, pyqtSignal, QObject, QPoint
    from PyQt5.QtGui import QFont, QColor, QLinearGradient, QPalette, QBrush
except ImportError:
    print("PyQt5를 설치 중입니다...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyQt5", "-q"])
    from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                                  QPushButton, QLabel, QTextEdit, QGraphicsDropShadowEffect, QFrame)
    from PyQt5.QtCore import Qt, pyqtSignal, QObject, QPoint
    from PyQt5.QtGui import QFont, QColor, QLinearGradient, QPalette, QBrush

EXTERNAL_DNS_PRIMARY = "1.1.1.1"
EXTERNAL_DNS_SECONDARY = "8.8.8.8"
PROXY_LISTEN_IP = "127.0.0.1"
PROXY_LISTEN_PORT = 8080
BUFFER_SIZE = 32768

class Signals(QObject):
    log_signal = pyqtSignal(str)
    status_signal = pyqtSignal(dict)

signals = Signals()

class SystemConfigManager:
    def __init__(self):
        self.interface_name = None
        self.internet_settings = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            r"Software\Microsoft\Windows\CurrentVersion\Internet Settings",
            0, winreg.KEY_ALL_ACCESS
        )

    def get_active_interface(self):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("1.1.1.1", 80))
            local_ip = s.getsockname()[0]
            s.close()
            
            cmd = f'powershell -Command "Get-NetIPAddress -IPAddress {local_ip} | Select-Object -ExpandProperty InterfaceAlias"'
            result = subprocess.run(cmd, stdout=subprocess.PIPE, text=True, shell=True)
            self.interface_name = result.stdout.strip()
            
            if self.interface_name:
                signals.log_signal.emit(f"인터페이스 감지: {self.interface_name}")
                return True
        except:
            pass
        signals.log_signal.emit("인터페이스를 찾을 수 없습니다.")
        return False

    def set_dns(self):
        if not self.interface_name: return
        signals.log_signal.emit(f"DNS 라우팅 재설정 (Cloudflare)")
        subprocess.run(f'netsh interface ip set dns name="{self.interface_name}" static {EXTERNAL_DNS_PRIMARY}', shell=True, stdout=subprocess.DEVNULL)
        subprocess.run(f'netsh interface ip add dns name="{self.interface_name}" {EXTERNAL_DNS_SECONDARY} index=2', shell=True, stdout=subprocess.DEVNULL)

    def restore_dns(self):
        if not self.interface_name: return
        signals.log_signal.emit("DNS 설정 복원 (DHCP)")
        subprocess.run(f'netsh interface ip set dns name="{self.interface_name}" dhcp', shell=True, stdout=subprocess.DEVNULL)

    def set_proxy(self):
        proxy_str = f"{PROXY_LISTEN_IP}:{PROXY_LISTEN_PORT}"
        signals.log_signal.emit(f"SNI 터널링 활성화")
        try:
            winreg.SetValueEx(self.internet_settings, "ProxyEnable", 0, winreg.REG_DWORD, 1)
            winreg.SetValueEx(self.internet_settings, "ProxyServer", 0, winreg.REG_SZ, proxy_str)
            ctypes.windll.wininet.InternetSetOptionW(0, 39, 0, 0)
            ctypes.windll.wininet.InternetSetOptionW(0, 37, 0, 0)
        except Exception as e:
            signals.log_signal.emit(f"프록시 설정 실패: {e}")

    def restore_proxy(self):
        signals.log_signal.emit("터널링 해제")
        try:
            winreg.SetValueEx(self.internet_settings, "ProxyEnable", 0, winreg.REG_DWORD, 0)
            ctypes.windll.wininet.InternetSetOptionW(0, 39, 0, 0)
            ctypes.windll.wininet.InternetSetOptionW(0, 37, 0, 0)
        except Exception as e:
            signals.log_signal.emit(f"프록시 복구 실패: {e}")

def forward_data(source, destination, is_upstream):
    try:
        if is_upstream:
            data = source.recv(BUFFER_SIZE)
            if not data: return
            destination.sendall(data[:1])
            destination.sendall(data[1:])
        while True:
            data = source.recv(BUFFER_SIZE)
            if not data: break
            destination.sendall(data)
    except Exception:
        pass
    finally:
        try: destination.shutdown(socket.SHUT_RDWR) 
        except: pass
        try: destination.close() 
        except: pass

def handle_connection(client_sock):
    target_sock = None
    try:
        client_sock.settimeout(3.0)
        request = client_sock.recv(4096)
        if not request: return

        first_line = request.decode('utf-8', errors='ignore').split('\n')[0]
        
        if 'CONNECT' in first_line:
            host_port = first_line.split(' ')[1]
            host, port = host_port.split(':')
            port = int(port)

            target_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            target_sock.settimeout(10)
            target_sock.connect((host, port))

            client_sock.settimeout(None)
            target_sock.settimeout(None)

            client_sock.sendall(b"HTTP/1.1 200 Connection Established\r\n\r\n")

            t_up = threading.Thread(target=forward_data, args=(client_sock, target_sock, True), daemon=True)
            t_down = threading.Thread(target=forward_data, args=(target_sock, client_sock, False), daemon=True)
            
            t_up.start()
            t_down.start()
            
            t_up.join()
            t_down.join()
        else:
            client_sock.close()

    except Exception:
        pass
    finally:
        if client_sock: client_sock.close()
        if target_sock: target_sock.close()

def start_server(stop_event):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
    
    try:
        server.bind((PROXY_LISTEN_IP, PROXY_LISTEN_PORT))
        server.listen(200)
        
        while not stop_event.is_set():
            try:
                server.settimeout(1.0)
                client, addr = server.accept()
                threading.Thread(target=handle_connection, args=(client,), daemon=True).start()
            except socket.timeout:
                continue
            except OSError:
                break
    except Exception as e:
        signals.log_signal.emit(f"서버 오류: {e}")
    finally:
        server.close()

class FreeViewApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.is_running = False
        self.stop_event = threading.Event()
        self.sys_config = None
        self.server_thread = None
        
        if not ctypes.windll.shell32.IsUserAnAdmin():
            print("Admin required")
        
        self.init_ui()
        signals.log_signal.connect(self.add_log)
        signals.status_signal.connect(self.update_status)

    def init_ui(self):
        self.setWindowTitle("FreeView")
        self.setGeometry(100, 100, 360, 560)
        self.setFixedSize(360, 560)
        
        try:
            from PyQt5.QtGui import QIcon
            self.setWindowIcon(QIcon("logo.ico"))
        except:
            pass

        # macOS 스타일 배경 색상
        self.setStyleSheet("""
            QMainWindow {
                background-color: #F5F5F7;
            }
        """)
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        main_layout = QVBoxLayout()
        main_layout.setSpacing(0)
        main_layout.setContentsMargins(0, 0, 0, 0)
        
        # 1. 상단 여백
        main_layout.addStretch(2)
        
        # 2. 타이틀 영역
        title_container = QWidget()
        title_layout = QVBoxLayout(title_container)
        title_layout.setContentsMargins(0,0,0,0)
        
        title = QLabel("FreeView")
        # 폰트 굵기를 줄임 (Weight 25 = Light)
        title_font = QFont('Segoe UI', 40) 
        title_font.setWeight(25) 
        title_font.setLetterSpacing(QFont.AbsoluteSpacing, -0.5)
        title.setFont(title_font)
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("color: #1D1D1F;") 
        
        # 타이틀 그림자
        shadow = QGraphicsDropShadowEffect()
        shadow.setBlurRadius(20)
        shadow.setOffset(0, 5)
        shadow.setColor(QColor(0, 0, 0, 30))
        title.setGraphicsEffect(shadow)
        
        # 버전 수정 (1.2)
        subtitle = QLabel("Version 1.2")
        sub_font = QFont('Segoe UI', 9)
        subtitle.setFont(sub_font)
        subtitle.setAlignment(Qt.AlignCenter)
        subtitle.setStyleSheet("color: #86868B; margin-top: 5px;")
        
        title_layout.addWidget(title)
        title_layout.addWidget(subtitle)
        main_layout.addWidget(title_container)
        
        # 3. 중앙 여백
        main_layout.addStretch(3)
        
        # 4. 버튼 영역
        button_container = QWidget()
        button_layout = QVBoxLayout(button_container)
        button_layout.setContentsMargins(0,0,0,0)
        
        self.power_btn = QPushButton("Deactivated")
        self.power_btn.setFixedSize(160, 50)
        self.power_btn.setCursor(Qt.PointingHandCursor)
        self.power_btn.clicked.connect(self.toggle_service)
        
        btn_shadow = QGraphicsDropShadowEffect()
        btn_shadow.setBlurRadius(15)
        btn_shadow.setOffset(0, 4)
        btn_shadow.setColor(QColor(0, 0, 0, 25))
        self.power_btn.setGraphicsEffect(btn_shadow)
        
        self.set_btn_style_off()
        
        button_layout.addWidget(self.power_btn, 0, Qt.AlignCenter)
        main_layout.addWidget(button_container)
        
        # 5. 하단 여백
        main_layout.addStretch(3)
        
        # 6. 로그 영역
        log_wrapper = QWidget()
        log_wrapper_layout = QVBoxLayout(log_wrapper)
        log_wrapper_layout.setContentsMargins(25, 0, 25, 30)
        
        log_label = QLabel("SYSTEM STATUS")
        log_label.setFont(QFont('Segoe UI', 8, QFont.Bold))
        log_label.setStyleSheet("color: #86868B; margin-bottom: 5px; margin-left: 5px;")
        log_wrapper_layout.addWidget(log_label)

        self.logs_text = QTextEdit()
        self.logs_text.setReadOnly(True)
        self.logs_text.setFixedHeight(140)
        self.logs_text.setFrameShape(0)
        
        self.logs_text.setStyleSheet("""
            QTextEdit {
                background-color: #FFFFFF;
                color: #424245;
                border-radius: 12px;
                padding: 15px;
                font-family: 'Consolas', 'Menlo', monospace;
                font-size: 11px;
                line-height: 140%;
                border: 1px solid #E5E5EA;
            }
        """)
        
        log_shadow = QGraphicsDropShadowEffect()
        log_shadow.setBlurRadius(10)
        log_shadow.setOffset(0, 2)
        log_shadow.setColor(QColor(0, 0, 0, 10))
        self.logs_text.setGraphicsEffect(log_shadow)
        
        log_wrapper_layout.addWidget(self.logs_text)
        main_layout.addWidget(log_wrapper)

        central_widget.setLayout(main_layout)

    def set_btn_style_off(self):
        self.power_btn.setText("OFF")
        self.power_btn.setStyleSheet("""
            QPushButton {
                background-color: qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0 #FFFFFF, stop:1 #F2F2F7);
                color: #8E8E93;
                border-radius: 25px;
                border: 1px solid #D1D1D6;
                font-family: 'Segoe UI', sans-serif;
                font-size: 15px;
                font-weight: 600;
                letter-spacing: 1px;
            }
            QPushButton:hover {
                background-color: #FFFFFF;
                border: 1px solid #C7C7CC;
            }
            QPushButton:pressed {
                background-color: #E5E5EA;
            }
        """)

    def set_btn_style_on(self):
        self.power_btn.setText("ACTIVE")
        self.power_btn.setStyleSheet("""
            QPushButton {
                background-color: qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0 #34C759, stop:1 #30B753);
                color: white;
                border-radius: 25px;
                border: none;
                font-family: 'Segoe UI', sans-serif;
                font-size: 15px;
                font-weight: 700;
                letter-spacing: 1px;
            }
            QPushButton:hover {
                background-color: qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0 #3CD862, stop:1 #32BE56);
            }
        """)

    def toggle_service(self):
        if not self.is_running:
            self.start_service()
        else:
            self.stop_service()

    def start_service(self):
        self.is_running = True
        self.set_btn_style_on()
        
        self.logs_text.clear()
        self.add_log("System initializing...")
        
        self.stop_event.clear()
        self.sys_config = SystemConfigManager()
        
        def run_service():
            if not self.sys_config.get_active_interface():
                signals.log_signal.emit("Error: No active interface found.")
                self.is_running = False
                return
            
            self.server_thread = threading.Thread(target=start_server, args=(self.stop_event,), daemon=True)
            self.server_thread.start()
            time.sleep(0.5)
            
            self.sys_config.set_dns()
            self.sys_config.set_proxy()
            signals.log_signal.emit("✓ Service is fully operational.")
        
        threading.Thread(target=run_service, daemon=True).start()

    def stop_service(self):
        self.is_running = False
        self.set_btn_style_off()
        self.add_log("Stopping services...")
        
        self.stop_event.set()
        
        if self.sys_config:
            self.sys_config.restore_dns()
            self.sys_config.restore_proxy()
            
        self.add_log("✓ System standby.")

    def add_log(self, message):
        current_time = time.strftime("%H:%M:%S")
        formatted_msg = f"<span style='color:#8E8E93;'>[{current_time}]</span> {message}"
        self.logs_text.append(formatted_msg)
        
        cursor = self.logs_text.textCursor()
        cursor.movePosition(cursor.End)
        self.logs_text.setTextCursor(cursor)

    def update_status(self, status_dict):
        pass

    def closeEvent(self, event):
        if self.is_running:
            self.stop_service()
        event.accept()

if __name__ == "__main__":
    # 관리자 권한 체크
    if not ctypes.windll.shell32.IsUserAnAdmin():
        # 관리자 권한이 없으면, 관리자 권한으로 자기 자신을 재실행 ('runas' 명령어 사용)
        ctypes.windll.shell32.ShellExecuteW(
            None, "runas", sys.executable, " ".join(sys.argv), None, 1
        )
        sys.exit() # 현재 권한 없는 프로세스는 종료

    # 관리자 권한이 있으면 앱 실행
    app = QApplication(sys.argv)
    
    # 고해상도 모니터 대응
    app.setAttribute(Qt.AA_EnableHighDpiScaling)
    app.setAttribute(Qt.AA_UseHighDpiPixmaps)
    
    font = QFont("Segoe UI")
    font.setStyleStrategy(QFont.PreferAntialias)
    app.setFont(font)
    
    window = FreeViewApp()
    window.show()
    sys.exit(app.exec_())