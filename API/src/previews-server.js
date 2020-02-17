import net from 'net'

const previews_socket = new net.Socket();
previews_socket.setNoDelay(true);
previews_socket.on('error', _ => {})
previews_socket.on('close', _ => {
  setTimeout(() => previews_socket.connect(6000, '127.0.0.1'), 1000);
})

previews_socket.connect(6000, '127.0.0.1');

export {
  previews_socket
}