import yaml
from user_classes import *

def compare(user1, user2):
    same = []
    if len(user1.food_prefs) >= len(user2.food_prefs):
        #print (len(user1.food_prefs), len(user2.food_prefs))
        for a in range(len(user2.food_prefs)):
            print (user2.food_prefs[a], user1.food_prefs)
            if user2.food_prefs[a] in user1.food_prefs:
                same.append(user2.food_prefs[a])
    else:
        #print (len(user1.food_prefs), len(user2.food_prefs))
        for a in range(len(user1.food_prefs)):
            print (user1.food_prefs[a], user2.food_prefs)
            if user1.food_prefs[a] in user2.food_prefs:
                same.append(user1.food_prefs[a])

    return (same)

"""
f = open("/home/noah/Meeting-Magic/User/user_config.yaml", "r")
text = f.read()
yamld = yaml.load(text)
localUser = yamld #remember, this is the funky human-readable but class instantiating thing, like User(username=bsasf, etc.)
#REPLACE THIS WITH GETTING OTHER USER
otherUser = LocalUser("Noah")
#otherUser.add_food_prefs("Gujarati", "Mango", "Pizza", "Jewish")

sameList = compare(localUser, otherUser)
"""
