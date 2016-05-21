import yaml
from user_classes import *

localUser = yaml.load("User/user_config.yaml")
otherUser = User("Noah")
otherUser.add_food_prefs("Gujarati", "Sushi", "Pizza", "Jewish")

luPrefs = localUser.food_prefs
ouPrefs = otherUser.food_prefs

#def compare(user1, user2):
#    for a in user1.food_prefs
