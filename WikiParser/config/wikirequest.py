import time
import requests

__Session = requests.Session()

def sessionGet(url, params = {}):
  request = __Session.get(url = url, params = params)

  if request.status_code != 200:
    print('Got status code', request.status_code, 'for', url)
  
  return request

# https://gbf.wiki/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=File:
def getImageURL(image) -> str:
  time.sleep(.1) # Don't hammer the server
  request = sessionGet(
    url = 'https://gbf.wiki/api.php',
    params = {
      'action': 'query',
      'prop': 'imageinfo',
      'iiprop': 'url',
      'format': 'json',
      'titles': 'File:' + image
    })
  request_json = request.json()['query']['pages']
  try:
    return next(iter(request_json.values()))['imageinfo'][0]['url']
  except:
    print(request_json)
    raise
