import json
import py_node as pn
from food import food_preference_matcher as fpm
from food import fetch_restaurants as fr
from pymysql import read_db as rdb

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
for i in range(len(prefs_list)):
     foundList = fr.get_restaurants(
        lat,
        lon,
        rad,
        prefs_list[i]
     )
