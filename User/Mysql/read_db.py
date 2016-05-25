# -- SQLAlchemy -- #
from models import Base, User
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# -- user_classes.py --#
from user_classes import LocalUser

db_owner = "root"
db_passwd = "123noah123"
host = "localhost"
db = "MeetingMagic"

engine = create_engine('mysql://' + db_owner + ':' + db_passwd + '@' + host +'/' + db)
Base.metadata.bind = engine
DBSession = sessionmaker()
DBSession.bind = engine
session = DBSession()

print session.query(User).filter(User.u_name == "NoahW").one()

def read_user(uname):
    dbUser = session.query(User).filter(User.u_name == "NoahW").one()
    locUser = LocalUser(dbUser.u_name)
    food_prefs = (dbUser.food_pref).split(",")
    locUser.add_food_prefs(food_prefs)
    return locUser

print read_user("NoahW")

"""
# Make a query to find all Persons in the database
session.query(Person).all()
# Return the first Person from all Persons in the database
person = session.query(Person).first()
person.name
u'new person'

# Find all Address whose person field is pointing to the person object
session.query(Address).filter(Address.person == person).all()

# Retrieve one Address whose person field is point to the person object
session.query(Address).filter(Address.person == person).one()
address = session.query(Address).filter(Address.person == person).one()
address.post_code
u'00000'
"""

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
