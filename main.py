import yaml
from user_classes import *

newUser = User("Lajja")
newUser.add_food_prefs("Punjabi", "Gujarati", "Taco Bell", "Pizza")

data = newUser
stream = file('User/user_config.yaml', 'w')
yaml.dump(data, stream)

# DEBUG
'''
print (
    yaml.dump(newUser)
)

User2 = (yaml.load(yaml.dump(newUser)))
print User2
'''
