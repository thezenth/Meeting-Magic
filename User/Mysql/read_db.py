#TUTORIAL LINK:http://docs.peewee-orm.com/en/latest/peewee/quickstart.html

from peewee import *
from models import User

db = SqliteDatabase('MeetingMagic.db')
db.connect()

def read_users(u_name):
    usr = User.get(User.username == u_name)
    db.close()
