#TUTORIAL LINK:http://docs.peewee-orm.com/en/latest/peewee/quickstart.html

from peewee import *
from models import User
from user_classes import LocalUser

db = SqliteDatabase('MeetingMagic.db')
db.connect()

def read_user(u_name):
    usr = User.get(User.username == u_name)
    locUsr = LocalUser(usr.username)
    food_prefs = (usr.food_pref).split(",")
    locUsr.add_food_prefs(food_prefs)
    db.close()
    return locUsr

noah = read_user("NoahW")
