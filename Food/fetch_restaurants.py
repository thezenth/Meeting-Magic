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
    def __init__(self, ident, name, address, lati, longi, hours, rate):
        self.id = str(ident) #ALL VALUES FROM FACTUAL API MUST BE TYPED OR FORMATTING IS SUPER WEIRD
        self.name = str(name)
        self.address = str(address)
        self.latitude = float(lati)
        self.longitude = float(longi)

        self.hours = "Not available" #this is an array
        if len(hours) > 0:
            self.hours = ''.join(hours)

        self.rating = str(rate) #String because it is going to be displayed, not useful as a float --> also, allows it to be "Not available"

    def __repr__(self): #printable representation of the object
        return "%s(id=%r, name=%r, address=%r, latitude=%r, longitude=%r, hours=%r, rating=%r)" % (
            self.__class__.__name__, self.id, self.name, self.address, self.latitude, self.longitude, self.hours, self.rating
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
    elif rankBy is "distance":
        radius = "" #CANT HAVE RADIUS WHEN SORTING BY DISTANCE
        rank_by = "rankby=" + rankBy
    elif rankBy is "prominence": #REMEMBER, PROMINENCE =/= RATING, BUT ALSO INCLUDES GOOGLE SEARCH RANK AND OTHER NEAT STUFF
        rank_by = "rankby=" + rankBy

    authKey = "key=" + oauth
    url = base + location + "&" + radius + "&" + search + "&" + place_type + "&" + rank_by + "&" + authKey
    print url
    return url
# EX: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=34.058583,-118.416582&radius=5000&keyword=coffee&rankby=prominence&types=food&key=AIzaSyDpHahG-VLpYYZo238mbnHdFfLqLf91rSQ

def get_restaurants (lati, longi, rad, cat):
    r = requests.get(
        build_url(lati, longi, rad, cat, goog_key)
    )

    jason = r.json()
    results = jason['results']

    for i in range(len(results)):
        curr_rest = results[i]
        ident = "Not available"
        name = "Not available"
        address = "Not available"
        rest_latitude = 0.0
        rest_longitude = 0.0
        rating = "Not available"
        hours = []

        if 'id' in curr_rest:
            ident = curr_rest['id']

        if 'name' in curr_rest:
            name = curr_rest['name']

        if 'vicinity' in curr_rest:
            address = curr_rest['vicinity']

        if 'geometry' in curr_rest:
            if 'location' in curr_rest['geometry']:
                if 'lat' in curr_rest['geometry']['location']:
                    rest_latitude = curr_rest['geometry']['location']['lat']
                if 'lng' in curr_rest['geometry']['location']:
                    rest_longitude = curr_rest['geometry']['location']['lng']

        if 'rating' in curr_rest:
            rating = curr_rest['rating']

        if 'opening_hours' in curr_rest:
            if 'weekday_text' in curr_rest['opening_hours']:
                if len(curr_rest['opening_hours']['weekday_text']) > 0:
                    hours = curr_rest['opening_hours']['weekday_text']

        newRest = Restaurant(ident, name, address, rest_latitude, rest_longitude, hours, rating)
        print (newRest.__repr__)

lati = 34.058583
longi = -118.416582
rad = 5000
category = "coffee"
get_restaurants(lati, longi, rad, category)

#FACTUAL STUFF

"""
key = "LkwWeSeAZT1xCBdQRcAqsjsoKAHQVOm7tE4KzfjX"

secret_key = "xI8R8pWMoRJspCY40g6rrAsr9s7idQ5JXoGzxEcO"
search_param = 'coffee'
lat = 34.058583
longi = -118.416582
rad = 1000
"""

"""
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
"""
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
