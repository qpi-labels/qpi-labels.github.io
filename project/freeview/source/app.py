import sys
import socket
import threading
import subprocess
import ctypes
import time
import winreg

# PyQt5 자동 설치
try:
    from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                                  QHBoxLayout, QPushButton, QLabel, QTextEdit)
    from PyQt5.QtCore import Qt, pyqtSignal, QObject
    from PyQt5.QtGui import QFont
except ImportError:
    print("PyQt5를 설치 중입니다...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyQt5", "-q"])
    from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                                  QHBoxLayout, QPushButton, QLabel, QTextEdit)
    from PyQt5.QtCore import Qt, pyqtSignal, QObject
    from PyQt5.QtGui import QFont

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
                signals.log_signal.emit(f"인터페이스: {self.interface_name} ({local_ip})")
                return True
        except:
            pass
        signals.log_signal.emit("인터페이스를 찾을 수 없습니다.")
        return False

    def set_dns(self):
        if not self.interface_name: return
        signals.log_signal.emit(f"DNS: Cloudflare({EXTERNAL_DNS_PRIMARY})")
        subprocess.run(f'netsh interface ip set dns name="{self.interface_name}" static {EXTERNAL_DNS_PRIMARY}', shell=True, stdout=subprocess.DEVNULL)
        subprocess.run(f'netsh interface ip add dns name="{self.interface_name}" {EXTERNAL_DNS_SECONDARY} index=2', shell=True, stdout=subprocess.DEVNULL)

    def restore_dns(self):
        if not self.interface_name: return
        signals.log_signal.emit("DNS 설정을 DHCP로 복구...")
        subprocess.run(f'netsh interface ip set dns name="{self.interface_name}" dhcp', shell=True, stdout=subprocess.DEVNULL)

    def set_proxy(self):
        proxy_str = f"{PROXY_LISTEN_IP}:{PROXY_LISTEN_PORT}"
        signals.log_signal.emit(f"시스템 프록시 설정: {proxy_str}")
        try:
            winreg.SetValueEx(self.internet_settings, "ProxyEnable", 0, winreg.REG_DWORD, 1)
            winreg.SetValueEx(self.internet_settings, "ProxyServer", 0, winreg.REG_SZ, proxy_str)
            ctypes.windll.wininet.InternetSetOptionW(0, 39, 0, 0)
            ctypes.windll.wininet.InternetSetOptionW(0, 37, 0, 0)
        except Exception as e:
            signals.log_signal.emit(f"프록시 설정 실패: {e}")

    def restore_proxy(self):
        signals.log_signal.emit("시스템 프록시 해제...")
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
        signals.log_signal.emit(f"SNI 프록시 가동 (TCP {PROXY_LISTEN_PORT})")
        
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
            self.show_error("관리자 권한이 필요합니다.")
            sys.exit(1)
        
        self.init_ui()
        signals.log_signal.connect(self.add_log)
        signals.status_signal.connect(self.update_status)

    def init_ui(self):
        self.setWindowTitle("FreeView")
        self.setGeometry(100, 100, 360, 580)
        
        try:
            from PyQt5.QtGui import QIcon
            self.setWindowIcon(QIcon("logo.ico"))
        except:
            pass
        self.setStyleSheet("""
            QMainWindow {
                background-color: #ffffff;
            }
            QPushButton {
                border: none;
                font-family: 'Pretendard Variable';
                font-weight: 500;
            }
            QLabel {
                font-family: 'Pretendard Variable';
            }
        """)
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout()
        main_layout.setSpacing(0)
        main_layout.setContentsMargins(0, 0, 0, 0)
        
        # Top Section - Logo & Title
        top_section = QWidget()
        top_layout = QVBoxLayout()
        top_layout.setContentsMargins(40, 80, 40, 60)
        top_layout.setSpacing(6)
        
        title = QLabel("FreeView")
        title_font = QFont('BR Cobane', 40)
        title_font.setWeight(QFont.Bold)
        title.setFont(title_font)
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("color: #000000;")
        
        subtitle = QLabel("v1.1")
        subtitle_font = QFont('Pretendard Variable', 10)
        subtitle.setFont(subtitle_font)
        subtitle.setAlignment(Qt.AlignCenter)
        subtitle.setStyleSheet("color: #bbbbbb;")
        
        top_layout.addWidget(title)
        top_layout.addWidget(subtitle)
        
        top_section.setLayout(top_layout)
        main_layout.addWidget(top_section)
        
        # Middle Section - Toggle
        middle_section = QWidget()
        middle_layout = QVBoxLayout()
        middle_layout.setContentsMargins(40, 0, 40, 60)
        middle_layout.setSpacing(16)
        
        # Status text
        self.status_text = QLabel("중지됨")
        status_font = QFont('Pretendard Variable', 12)
        status_font.setWeight(QFont.Bold)
        self.status_text.setFont(status_font)
        self.status_text.setAlignment(Qt.AlignCenter)
        self.status_text.setStyleSheet("color: #888888;")
        
        # Toggle button
        self.power_btn = QPushButton()
        self.power_btn.setFixedHeight(60)
        self.power_btn.setStyleSheet("""
            QPushButton {
                background-color: #f0f0f0;
                border-radius: 14px;
                border: none;
                font-size: 32px;
            }
            QPushButton:hover {
                background-color: #e5e5e5;
            }
        """)
        self.power_btn.setCursor(Qt.PointingHandCursor)
        self.power_btn.clicked.connect(self.toggle_service)
        self.update_power_btn()
        
        middle_layout.addWidget(self.status_text)
        middle_layout.addWidget(self.power_btn)
        middle_layout.addStretch()
        
        middle_section.setLayout(middle_layout)
        main_layout.addWidget(middle_section)
        
        # Logs Section
        logs_section = QWidget()
        logs_layout = QVBoxLayout()
        logs_layout.setContentsMargins(30, 0, 30, 30)
        logs_layout.setSpacing(10)
        
        self.logs_text = QTextEdit()
        self.logs_text.setReadOnly(True)
        self.logs_text.setStyleSheet("""
            QTextEdit {
                background-color: #fafafa;
                color: #777777;
                border: 1px solid #e8e8e8;
                border-radius: 6px;
                padding: 10px;
                font-family: 'Courier New';
                font-size: 10px;
            }
        """)
        self.logs_text.setFixedHeight(100)
        
        logs_layout.addWidget(self.logs_text)
        
        logs_section.setLayout(logs_layout)
        main_layout.addWidget(logs_section)
        
        # Footer
        footer = QLabel("Administrator Mode")
        footer_font = QFont('Pretendard Variable', 8)
        footer.setFont(footer_font)
        footer.setAlignment(Qt.AlignCenter)
        footer.setStyleSheet("color: #dddddd;")
        
        main_layout.addWidget(footer)
        main_layout.addSpacing(12)
        
        central_widget.setLayout(main_layout)

    def update_power_btn(self):
        if self.is_running:
            self.power_btn.setText("⊙")
            self.power_btn.setStyleSheet("""
                QPushButton {
                    background-color: #10b981;
                    border-radius: 14px;
                    border: none;
                    font-size: 32px;
                    color: white;
                }
                QPushButton:hover {
                    background-color: #059669;
                }
            """)
        else:
            self.power_btn.setText("○")
            self.power_btn.setStyleSheet("""
                QPushButton {
                    background-color: #f0f0f0;
                    border-radius: 14px;
                    border: none;
                    font-size: 32px;
                    color: #bbbbbb;
                }
                QPushButton:hover {
                    background-color: #e5e5e5;
                }
            """)

    def toggle_service(self):
        if not self.is_running:
            self.start_service()
        else:
            self.stop_service()

    def start_service(self):
        self.is_running = True
        self.status_text.setText("실행 중")
        self.status_text.setStyleSheet("color: #10b981;")
        self.update_power_btn()
        
        self.stop_event.clear()
        self.sys_config = SystemConfigManager()
        
        def run_service():
            if not self.sys_config.get_active_interface():
                self.is_running = False
                self.status_text.setText("중지됨")
                self.status_text.setStyleSheet("color: #888888;")
                self.update_power_btn()
                return
            
            self.server_thread = threading.Thread(target=start_server, args=(self.stop_event,), daemon=True)
            self.server_thread.start()
            time.sleep(0.5)
            
            self.sys_config.set_dns()
            self.sys_config.set_proxy()
            signals.log_signal.emit("✓ 작동 중...")
        
        threading.Thread(target=run_service, daemon=True).start()

    def stop_service(self):
        self.is_running = False
        self.status_text.setText("중지됨")
        self.status_text.setStyleSheet("color: #888888;")
        self.update_power_btn()
        
        signals.log_signal.emit("⊘ 종료 요청")
        self.stop_event.set()
        
        if self.sys_config:
            self.sys_config.restore_dns()
            self.sys_config.restore_proxy()
        
        signals.log_signal.emit("⊘ 서비스 종료")

    def add_log(self, message):
        current = self.logs_text.toPlainText()
        lines = current.split('\n')
        lines = lines[-7:] if len(lines) > 7 else lines
        lines.append(message)
        self.logs_text.setText('\n'.join(lines))
        self.logs_text.verticalScrollBar().setValue(self.logs_text.verticalScrollBar().maximum())

    def update_status(self, status_dict):
        pass

    def closeEvent(self, event):
        if self.is_running:
            self.stop_service()
        event.accept()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = FreeViewApp()
    window.show()
    sys.exit(app.exec_())