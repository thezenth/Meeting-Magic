#TUTORIAL LINK:http://docs.peewee-orm.com/en/latest/peewee/quickstart.html

from peewee import *
from models import User_DB, Food_Pref

db = SqliteDatabase('MeetingMagic.db')
db.connect()

lajja = User_DB.select()
