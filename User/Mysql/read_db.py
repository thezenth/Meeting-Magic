#TUTORIAL LINK:http://docs.peewee-orm.com/en/latest/peewee/quickstart.html

from peewee import *
from models import User_DB, Food_Pref

db = SqliteDatabase('MeetingMagic.db')
db.connect()

def read_users(u_name):
    usr = User_DB.get(User_DB.username == u_name)
