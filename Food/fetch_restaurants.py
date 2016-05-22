import json
import yaml
from factual import Factual
from factual.utils import circle
import pprint

#MAKE SURE TO KEEP THIS UPDATED WITH FOOD/FETCH_CONFIG.YAML
class restaurant:
    def __init__(self, name, address, distance, hours):
        self.name = str(name) #ALL VALUES FROM FETCH API MUST BE TYPED OR FORMATTING IS SUPER WEIRD
        self.address = str(address)
        self.hours = str(hours)
        self.distance = float(distance) #FLOAT
    def __repr__(self): #printable representation of the object
        return "%s(name=%r, address=%r, distance=%r, hours=%r)" % (
            self.__class__.__name__, self.name, self.address, self.distance, self.hours
        )

def spprint(txt, doPrint=False):
    idx1 = txt.index("u") + 1 # + 1 to include the ' at the very beginning
    idx2 = len(txt)
    newTxt = txt[idx1:idx2]
    if doPrint is True:
        print (newTxt)
    else:
        return (newTxt)

pp = pprint.PrettyPrinter(indent=4) #pretty printer for debug

lat = 34.058583
lang = -118.416582
rad = 1000

key = "LkwWeSeAZT1xCBdQRcAqsjsoKAHQVOm7tE4KzfjX"
secret_key = "xI8R8pWMoRJspCY40g6rrAsr9s7idQ5JXoGzxEcO"

def get_restaurants ():
    factual = Factual(key, secret_key)
    places = factual.table('places')
    data = places.search('coffee').geo(circle(34.058583, -118.416582, 1000)).data() #outputs a list of different objects, each object having info on the place
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
        raw = data[i]
        vals = []
        for a in getList:
            vals.append(
                raw.get(getList[a], None)
            )

        print restaurant(
            raw.get(getList['name'], None),
            raw.get(getList['address'], None),
            raw.get(getList['distance'], None),
            raw.get(getList['hours'], None)
        )

        restsList.append(
            restaurant(
                raw.get(getList['name'], None),
                raw.get(getList['address'], None),
                raw.get(getList['distance'], None),
                raw.get(getList['hours'], None)
            )
        )
        #for a in getList:

            #just in case we REALLY need to parse a list
            #if a == 'hours':
            #    for b in range(len(getList[a])):
            #        print getList[a][b]
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
