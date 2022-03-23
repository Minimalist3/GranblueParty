#!/usr/bin/python3
# -*- coding: utf-8 -*-

import os
import sys
import threading

from preview import server, friendsum, party, paths
from config import dbconfig, defines

###
def processQueue():
  while True:
    id = server.requests_queue.get()
    if id[0] == 'p':
      party.processPartyRequest(id[1:])
    elif id[0] == 'f':
      friendsum.processFriendSumRequest(id[1:])

###
def main(argv):
  if not os.path.abspath(paths.PREVIEWS_DIR):
    print('Path is not absolute', paths.PREVIEWS_DIR)
    return 2

  # Make sure the directory exists
  if not os.path.exists(paths.PREVIEWS_DIR) or not os.path.isdir(paths.PREVIEWS_DIR):
    print('Directory doesn\'t exist', paths.PREVIEWS_DIR)
    return 3
  if not os.path.exists(paths.UNITS_DIR) or not os.path.isdir(paths.UNITS_DIR):
    print('Directory doesn\'t exist', paths.UNITS_DIR)
    return 3
  if not os.path.exists(paths.FRONTEND_IMG_DIR) or not os.path.isdir(paths.FRONTEND_IMG_DIR):
    print('Directory doesn\'t exist', paths.FRONTEND_IMG_DIR)
    return 3

  # Create subdirectories
  if not os.path.isdir(paths.PARTY_DIR):
    os.mkdir(paths.PARTY_DIR)
  if not os.path.isdir(paths.FRIENDSUM_DIR):
    os.mkdir(paths.FRIENDSUM_DIR)

  # Option --all to generate all parties at once
  if len(argv) == 1:
    if argv[0] == '--all':
      dbconfig.getCursor().execute('SELECT partyid FROM party')
      result = dbconfig.getCursor().fetchall()
      print('Processing', len(result), 'parties')
      for p in result:
        party.processPartyRequest(str(p[0]))
    else:
      party.processPartyRequest(str(argv[0]))

  # Normal mode
  else:
    # Set non-blocking, read-only, SQL connection
    dbconfig.setAutoCommit()

    # Start the processing queue in a single thread
    queue_thread = threading.Thread(target=processQueue)
    queue_thread.daemon = True
    queue_thread.start()

    # The server uses other threads
    serv = server.PartyPreviewServer()
    serv.server_forever()

if __name__ == '__main__':
  main(sys.argv[1:])