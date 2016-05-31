class LocalUser:
    def __init__(self, ident, username, password): #initialize class
        self.id = ident
        self.username = username
        self.password = password
        self.food_prefs = []


    def add_food_prefs(self, *args): #add a food preference
        for p in args:
            self.food_prefs.append(p)

    def __repr__(self): #printable representation of the object
        return "%s(username=%r, food_prefs=%r)" % (
            self.__class__.__name__, self.username, self.food_prefs
        )
