import yaml
from user_classes import *

newUser = LocalUser("Lajja")
newUser.add_food_prefs("Punjabi", "Gujarati", "Taco Bell", "Pizza")

data = newUser
stream = file('User/user_config.yaml', 'w')
yaml.dump(data, stream)


stream2 = file('food_categories.yaml', 'r')
categories = yaml.load(stream2)
print categories["foods"]["pizza"]
print categories["dietary_restrictions"][0]

#stream2 = file('food_categories.yaml', #'w')
#yaml.dump(testDict, stream2#)

# DEBUG
'''
print (
    yaml.dump(newUser)
)

User2 = (yaml.load(yaml.dump(newUser)))
print User2
'''
