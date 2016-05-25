# -- peewee -- #
#ACTUALLY USE PWIZ
import peewee
from peewee import *

class User_DB(peewee.Model):
    """
    ORM model of Users table
    """
    ID = peewee.IntField()
    username = peewee.CharField()
    password = peewee.CharField()
    food_pref = peewee.CharField()

    class Meta:
        database = db
