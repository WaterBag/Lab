import socket
import time

server_ip = "34.102.102.213"
server_port = 5202


def udp_echo_test_keep_sock(server_ip, server_port, num_packets):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(1.0)
    message = b'Ping'
    delays = []
    for i in range(num_packets):
        try:
            send_time = time.time()
            sent = sock.sendto(message, (server_ip, server_port))
            data, server = sock.recvfrom(4096)
            recv_time = time.time()
            delay = recv_time - send_time
            delays.append(delay)
            print(f"Packet {i + 1}, delay: {delay * 1000:.2f} ms")
            time.sleep(5)
        except socket.timeout:
            print("Request timed out.")
            continue

    # 关闭套接字
    sock.close()

    if delays:
        avg_delay = sum(delays) / len(delays) * 1000  # 平均延迟转换为毫秒
        print(f"平均延迟 {len(delays)} packets: {avg_delay:.2f} ms")


def udp_echo_test_not_keep_sock(server_ip, server_port, num_packets):
    message = b'Ping'
    delays = []
    for i in range(num_packets):
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(1.0)
        try:
            send_time = time.time()
            sent = sock.sendto(message, (server_ip, server_port))
            data, server = sock.recvfrom(4096)
            recv_time = time.time()
            delay = recv_time - send_time
            delays.append(delay)
            print(f"Packet {i + 1}, delay: {delay * 1000:.2f} ms")
        except socket.timeout:
            print("Request timed out.")
            continue
        finally:
            sock.close()

    if delays:
        avg_delay = sum(delays) / len(delays) * 1000  # 平均延迟转换为毫秒
        print(f"Average delay over {len(delays)} packets: {avg_delay:.2f} ms")



if __name__ == "__main__":
    udp_echo_test_keep_sock(server_ip, server_port, 10)
    # udp_echo_test_not_keep_sock(server_ip, server_port, 10)
