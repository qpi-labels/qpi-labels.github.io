import sys
import socket
import threading
import subprocess
import ctypes
import time
import winreg

EXTERNAL_DNS_PRIMARY = "1.1.1.1"
EXTERNAL_DNS_SECONDARY = "8.8.8.8"

PROXY_LISTEN_IP = "127.0.0.1"
PROXY_LISTEN_PORT = 8080
BUFFER_SIZE = 32768

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
                print(f"인터페이스: {self.interface_name} ({local_ip})")
                return True
        except:
            pass
        print("인터페이스를 찾을 수 없습니다.")
        return False

    def set_dns(self):
        if not self.interface_name: return
        print(f"DNS : Cloudflare({EXTERNAL_DNS_PRIMARY})")
        subprocess.run(f'netsh interface ip set dns name="{self.interface_name}" static {EXTERNAL_DNS_PRIMARY}', shell=True, stdout=subprocess.DEVNULL)
        subprocess.run(f'netsh interface ip add dns name="{self.interface_name}" {EXTERNAL_DNS_SECONDARY} index=2', shell=True, stdout=subprocess.DEVNULL)

    def restore_dns(self):
        if not self.interface_name: return
        print(f"DNS 설정을 DHCP로 복구...")
        subprocess.run(f'netsh interface ip set dns name="{self.interface_name}" dhcp', shell=True, stdout=subprocess.DEVNULL)

    def set_proxy(self):
        proxy_str = f"{PROXY_LISTEN_IP}:{PROXY_LISTEN_PORT}"
        print(f"시스템 프록시 설정: {proxy_str}")
        try:
            winreg.SetValueEx(self.internet_settings, "ProxyEnable", 0, winreg.REG_DWORD, 1)
            winreg.SetValueEx(self.internet_settings, "ProxyServer", 0, winreg.REG_SZ, proxy_str)
            ctypes.windll.wininet.InternetSetOptionW(0, 39, 0, 0)
            ctypes.windll.wininet.InternetSetOptionW(0, 37, 0, 0)
        except Exception as e:
            print(f"프록시 설정 실패: {e}")

    def restore_proxy(self):
        print(f"시스템 프록시 해제...")
        try:
            winreg.SetValueEx(self.internet_settings, "ProxyEnable", 0, winreg.REG_DWORD, 0)
            ctypes.windll.wininet.InternetSetOptionW(0, 39, 0, 0)
            ctypes.windll.wininet.InternetSetOptionW(0, 37, 0, 0)
        except Exception as e:
            print(f"프록시 복구 실패: {e}")


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
        print(f"SNI 프록시 가동 (TCP {PROXY_LISTEN_PORT})")
        
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
        print(f"서버 오류: {e}")
    finally:
        server.close()

if __name__ == "__main__":
    if not ctypes.windll.shell32.IsUserAnAdmin():
        print("관리자 권한 필요")
        sys.exit(1)

    sys_config = SystemConfigManager()
    stop_event = threading.Event()

    try:
        if not sys_config.get_active_interface(): sys.exit(1)

        server_thread = threading.Thread(target=start_server, args=(stop_event,), daemon=True)
        server_thread.start()
        time.sleep(0.5)

        sys_config.set_dns()
        sys_config.set_proxy()

        print("\n작동 중. (종료: Ctrl+C)")
        while True: time.sleep(1)

    except KeyboardInterrupt:
        print("\n종료 요청.")
    except Exception as e:
        print(f"\n오류: {e}")
    finally:
        print("설정 복구 중...")
        stop_event.set()
        sys_config.restore_dns()
        sys_config.restore_proxy()
        print("종료 완료.")