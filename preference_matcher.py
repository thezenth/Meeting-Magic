import yaml
from user_classes import *

localUser = yaml.load("User/user_config.yaml")
otherUser = User("Noah")
otherUser.add_food_prefs("Gujarati", "Sushi", "Pizza", "Jewish")
