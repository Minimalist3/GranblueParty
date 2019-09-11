import psycopg2

from configparser import ConfigParser

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
    params = config('config/database.ini')
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

def config(filename='database.ini', section='postgresql'):
	# create a parser
	parser = ConfigParser()
	# read config file
	parser.read(filename)
 
	# get section, default to postgresql
	db = {}
	if parser.has_section(section):
		params = parser.items(section)
		for param in params:
			db[param[0]] = param[1]
	else:
		raise Exception('Section {0} not found in the {1} file'.format(section, filename))
 
	return db
