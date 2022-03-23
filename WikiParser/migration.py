#!/usr/bin/python3

import sys

import psycopg2.extras

from config import dbconfig

#
def migrationTo2():
  dbconfig.getCursor().execute('SELECT partyId, partyData FROM Party')
  parties = dbconfig.getCursor().fetchall()
  elements = []
  for p in parties:
    party_id = p[0]
    party_json = p[1]
    if 'weapons' in party_json and party_json['weapons'][0] is not None:
      dbconfig.getCursor().execute('SELECT elementId FROM Weapon WHERE weaponId = %s', [party_json['weapons'][0]])
      weapon_result = dbconfig.getCursor().fetchone()
      if weapon_result is not None:
        elements.append([weapon_result[0], party_id])

  psycopg2.extras.execute_batch(dbconfig.getCursor(), 'Update Party SET elementId = %s WHERE partyId=%s', elements)

#
def migrationTo3():
  dbconfig.getCursor().execute('ALTER TABLE Party ALTER COLUMN contentId DROP DEFAULT;')
  dbconfig.getCursor().execute('UPDATE Party SET contentId = NULL, public = FALSE WHERE contentId < 2;')

#
def updatedToVersion(version: int):
  dbconfig.getCursor().execute('UPDATE Settings SET value = %s WHERE key = %s;', [str(version), 'SCHEMA_VERSION'])

#
def main(argv):
  dbconfig.getCursor().execute('SELECT value FROM Settings WHERE key = %s', ['SCHEMA_VERSION'])
  result = dbconfig.getCursor().fetchone()
  version = 1

  if result is not None:
    version = int(result[0])
  else:
    dbconfig.getCursor().execute('INSERT INTO Settings (key, value) VALUES (%s, %s) ON CONFLICT DO NOTHING', ['SCHEMA_VERSION', '1'])

  # -> 2: Add elementId to parties
  if version < 2:
    migrationTo2()
    updatedToVersion(2)

  # -> 3: Change some contentIds
  if version < 3:
    migrationTo3()
    updatedToVersion(3)

if __name__ == '__main__':
  main(sys.argv[1:])
