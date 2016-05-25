from sqlalchemy import create_engine

engine = create_engine('mysql://root:123noah123@localhost/MeetingMagic')

connection = engine.connect()
result = connection.execute("select u_name from User")
for row in result:
    print("username:", row['u_name'])
connection.close()

"""
#TUTORIAL LINK:http://docs.peewee-orm.com/en/latest/peewee/quickstart.html

from peewee import *
from models import User
from user_classes import LocalUser

database = MySQLDatabase('MeetingMagic', **{'password': '123noah123'})
database.connect()

def read_user(input_name):
    usr = User.get(User.u_name == input_name)
    locUsr = LocalUser(usr.username)
    food_prefs = (usr.food_pref).split(",")
    locUsr.add_food_prefs(food_prefs)
    database.close()
    return locUsr

noah = read_user("'NoahW'")
print noah
"""
