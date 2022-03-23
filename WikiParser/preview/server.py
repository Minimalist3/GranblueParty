import queue
import socketserver

# Use a queue based on a set to prevent computing the same image multiple times
# We don't really care about priority
class SetQueue(queue.Queue):
  def _init(self, maxsize):
    self.queue = set()
  def _put(self, item):
    self.queue.add(item)
  def _get(self):
    return self.queue.pop()

requests_queue = SetQueue()

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
  allow_reuse_address = True

class PartyRequestHandler(socketserver.BaseRequestHandler):
  def handle(self):
    while True:
      # self.request is the TCP socket connected to the client
      self.data = str(self.request.recv(1024).strip(), "utf-8")

      if not self.data:
        return

      if self.data == 'EXIT':
        self.server.shutdown()
        return

      try:
        requests_queue.put(self.data)
      except ValueError:
        pass

class PartyPreviewServer:
  def __init__(self):
    self.server = None

  def server_forever(self):
    print('Starting previews server on port', 6000)
    self.server = ThreadedTCPServer(('localhost', 6000), PartyRequestHandler)
    try:
      self.server.serve_forever()
    except KeyboardInterrupt:
      pass
    self.server.server_close()
