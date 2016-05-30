import json
import py_node as pn
from food import food_preference_matcher as fpm
from food import fetch_restaurants as fr
from pymysql import read_db as rdb
from gen import html_gen as hg

import fileinput

radius = 5000 #User cannot set this variable yet... possibly in a later build_url
#Also, what units are this value in?

#Get meeting info
f = open('data.json', 'r')
f_str = f.read()
parsed = json.loads(f_str)
output = parsed[1]
allMeetings = output['meetingInfo']
currMeeting = allMeetings[0]
otherUser = currMeeting['otherUser']
lat = float(currMeeting['lat'])
lon = float(currMeeting['lon'])
f.close()

# Will have to use session info for this later...
# Get preferences of current user
f2 = open('data.json', 'r')
f2_str = f2.read()
parsed = json.loads(f_str)
output = parsed[1]
allUsers = output['userInfo']
currUser = allUsers[0]
username = currUser['username']
f2.close()
usr1 = rdb.read_user(username)

# Get preferences of other user
usr2 = rdb.read_user(otherUser)

# Compare preferences and get similar list
prefs_list = fpm.compare(usr1, usr2)
#pn.tell_node(','.join(prefs_list))
pn.tell_node("Finding restaurants...")
listOfLists = []
for i in range(len(prefs_list)):
    pn.tell_node("Getting set " + str(i))
    foundList = fr.get_restaurants(lat,lon,radius,prefs_list[i])
    if len(foundList) is not 0:
        listOfLists.append(foundList)
    else:
        pn.tell_node("  No restaurants found!")

f3 = open('data.json', 'r')
f3_str = f3.read()
f3.close()
jason = json.loads(f_str)
for a in range(len(listOfLists)):
    jason[0]['restaurants'].append(listOfLists[a])
print (jason)
f3 = open('data.json', 'w')
f3.write(
    json.dumps(jason, indent=4)
)
pn.tell_node("READY",ident="JSONREADY")

"""
lines = []
f_results = open('/home/noah/Meeting-Magic/Web/nodejs/views/results.html', 'r')
lines = [str(x) for x in f_results.readlines()]
pn.tell_node("Lines=" + "".join(lines))


pn.tell_node("Putting each list to HTML div..")
for a in range(len(listOfLists)):
    div = hg.results_div(listOfLists[a])
    for l in range(len(lines)):
        #pn.tell_node("Line is '" + line + "'")
        if "<body>" in str(lines[l]): #Not sure why I need vars here...
            lines.insert(l + 1, div) # Inserts the div code after the body tag

results_file = open('/home/noah/Meeting-Magic/Web/nodejs/views/results.html', 'w')
lines_str = ''.join(str(e) for e in lines)
pn.tell_node("New file=" + lines_str)
results_file.write(lines_str)
"""
