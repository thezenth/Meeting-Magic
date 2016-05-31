# -- Mysql Stuff -- #
from models_db import User, Base
# SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import func #used to get row count

# -- user_classes.py -- #
from user_classes import LocalUser

# -- write_db.py -- #
import write_db as wdb

# -- py_node.py -- #
import Web.nodejs.py_node as pn

db_owner = "root"
db_passwd = "123noah123"
host = "localhost"
db = "MeetingMagic"

engine = create_engine('mysql://' + db_owner + ':' + db_passwd + '@' + host +'/' + db)
Base.metadata.bind = engine
DBSession = sessionmaker()
DBSession.bind = engine
session = DBSession()

#print session.query(User).filter(User.u_name == "NoahW").one()

def read_user(uname, make_new=False, new_pwd=None):
    dbUser = session.query(User).filter(User.u_name == uname).first()
    if dbUser is None:
        if make_new:
            rows = session.query(func.count(User.id)).scalar() # get the number of users, related to the number of rows using primary key of id
            locUser = LocalUser(rows+1, uname, new_pwd) # make a new user
            wdb.write_user(locUser) # write the new user to the database
    else:
        locUser = LocalUser(dbUser.id, dbUser.u_name, dbUser.passwd)
        db_food_prefs = (dbUser.food_pref).split(",")
        locUser.food_prefs = db_food_prefs
    return locUser

#pn.tell_node("Hi, my name is read_db.py!")
#print read_user("NoahW")



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
