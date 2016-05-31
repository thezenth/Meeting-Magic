# -- SQLAlchemy -- #
from models_db import Base, User
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

def convert_to_db_user(new_local_user):
    return (
        User(
            id=new_local_user.id,
            u_name=new_local_user.username,
            passwd=new_local_user.password,
            food_pref=",".join(new_local_user.food_prefs) #convert the food_prefs list to a strin, from [X, Y, Z] to X,Y,Z
        )
    )

def write_user(new_user):
    new_db_user = convert_to_db_user(new_user)
    session.add(new_db_user)
    session.commit()

#billy = LocalUser(2, "Billy Joe", "BillyIsTheBest")
#billy.food_prefs = ["Mexican", "Italian", "American"]
#write_user(billy)
#def update_user(curr_user):
