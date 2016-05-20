import yaml

class User:
    def __init__(self, username): #initialize class
        self.username = username
        self.food_prefs = []

    def add_food_prefs(self, *args): #add a food preference
        for p in args:
            self.food_prefs.append(p)

    def __repr__(self): #printable representation of the object
        return "%s(username=%r, food_prefs=%r)" % (
            self.__class__.__name__, self.username, self.food_prefs
        )

newUser = User("Lajja")
newUser.add_food_prefs("Punjabi", "Gujarati", "Taco Bell", "Pizza")

data = newUser
stream = file('user_config.yaml', 'w')
yaml.dump(data, stream)

# DEBUG
'''
print (
    yaml.dump(newUser)
)

User2 = (yaml.load(yaml.dump(newUser)))
print User2
'''
