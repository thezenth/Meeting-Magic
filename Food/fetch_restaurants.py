import json
import yaml
import pprint

#FACTUAL API
from factual import Factual
from factual.utils import circle


#GOOGLE PLACES API
import requests

pp = pprint.PrettyPrinter(indent=4) #pretty printer for debug

#MAKE SURE TO KEEP THIS UPDATED WITH FOOD/FETCH_CONFIG.YAML
class Restaurant:
    def __init__(self, id):
        self.id = str(id) #ALL VALUES FROM FETCH API MUST BE TYPED OR FORMATTING IS SUPER WEIRD
        self.info = {}
    def fetch_info(self, dSet, *args):
        for a in args:
            newKey = a
            newValue = dSet.get(a, None)
            self.info[newKey] = newValue


    def __repr__(self): #printable representation of the object
        return "%s(name=%r, address=%r, distance=%r, hours=%r)" % (
            self.__class__.__name__, self.name, self.address, self.distance, self.hours
        )

goog_key = "AIzaSyDpHahG-VLpYYZo238mbnHdFfLqLf91rSQ"
def build_url(latitude, longitude, rad, query, oauth, types="food", rankBy="prominence"):
    base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
    location = "location=" + str(latitude) + "," + str(longitude)
    radius = "radius=" + str(rad)
    search = "keyword=" + query
    place_type = "types=" + types

    if rankBy is None:
        rank_by = ""
    else if rankBy is "distance":
        radius = "" #CANT HAVE RADIUS WHEN SORTING BY DISTANCE
        rank_by = "rankby=" + rankBy
    else if rankBy is "prominence": #REMEMBER, PROMINENCE =/= RATING, BUT ALSO INCLUDES GOOGLE SEARCH RANK AND OTHER NEAT STUFF
        rank_by = "rankby=" + rankBy

    authKey = "key=" + oauth
    url = base + location + "&" + radius + "&" + search + "&" + place_type + "&" + rank_by + "&" + authKey
    print url
    return url
# EX: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=34.058583,-118.416582&radius=5000&keyword=coffee&rankby=prominence&types=food&key=AIzaSyDpHahG-VLpYYZo238mbnHdFfLqLf91rSQ


def get restaurants (lati, longi, rad, cat):
    r = requests.get(
        build_url(lati, longi, rad, cat, goog_key)
    )

    jason = r.json()
    print jason['results'][0]['id']





key = "LkwWeSeAZT1xCBdQRcAqsjsoKAHQVOm7tE4KzfjX"
secret_key = "xI8R8pWMoRJspCY40g6rrAsr9s7idQ5JXoGzxEcO"

search_param = 'coffee'
lat = 34.058583
longi = -118.416582
rad = 1000



def spprint(txt, doPrint=False):
    idx1 = txt.index("u") + 1 # + 1 to include the ' at the very beginning
    idx2 = len(txt)
    newTxt = txt[idx1:idx2]
    if doPrint is True:
        print (newTxt)
    else:
        return (newTxt)



def get_restaurants ():
    factual = Factual(key, secret_key)
    places = factual.table('places')
    data = places.search(search_param).geo(circle(lat, longi, rad)).data() #outputs a list of different objects, each object having info on the place
    print data
    #pp.pprint(data) #good for debug, takes a little bit
    '''
    strm = file("fetch_config.yaml", "w")
    stuff = {'get': {"distance":"$distance","address":"address", "hours":["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], "telephone":"tel"}}
    yamlStuff = yaml.dump(stuff, default_flow_style=False)
    strm.write(yamlStuff)
    strm.close()
    '''

    restsList = []

    stream = file("fetch_config.yaml", "r")
    getList = yaml.load(stream)['get']

    for i in range(len(data)):
        raw = data[i] #remember, data is a list of objects, so raw refers to a specific object
        newRest = Restaurant(
            raw.get('factual_id', None) #factual_id SHOULDN'T be null... watch out anyway --- dic.get(key, default_value)
        )
        newRest.fetch_info(
            raw, *getList.values() # the * expands the list for *args, and since getlist is a dict, .values() gets only the values
        )

        #for a in getList:

            #just in case we REALLY need to parse a list
            #if a == 'hours':
            #        print getList[a][b]
            #    for b in range(len(getList[a])):
            #        print data[0][
            #            getList[a][b]
            #        ]
            #else:
    pp.pprint(restsList)

    #spprint(data[0]["tel"], doPrint=True)

#get_restaurants()

"""
keyInclude = "&KEY=" + key
url = 'http://api.v3.factual.com/t/places-us?filters={"$and":[{"name":{"$search":"starbucks"}},{"postcode":{"$eq":"90067"}}]}&select=name,address,latitude,longitude' + keyInclude #Get lat and long of all starbucks in 90067 postal code
r = requests.get(url)
if r.status_code != 200:
    print ("Couldn't access API! Error code: " + str(r.status_code))
    exit()
print r.text
json.loads(r.text)
"""
