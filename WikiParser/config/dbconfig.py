import psycopg2

from config import defines

# RAII to make sure the connection is closed
class Connection:
  _cursor = None
  _conn = None

  def __del__(self):
    closeConnection()

__Connection = Connection()

# Make a connection on first call
def getCursor():
  if not __Connection._cursor:
    params = defines.getConfig('config/config.ini', 'postgresql')
    __Connection._conn = psycopg2.connect(**params)
    __Connection._cursor = __Connection._conn.cursor()
    print('Database connection opened.')

  return __Connection._cursor

def closeConnection():
  if __Connection._conn:
    try:
      __Connection._conn.commit()
      __Connection._cursor.close()
      __Connection._cursor = None
    except (Exception, psycopg2.DatabaseError) as error:
      print(error)
    finally:
      if __Connection._conn is not None:
        __Connection._conn.close()
        __Connection._conn = None
        print('Database connection closed.')
