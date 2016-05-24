# -- peewee -- #
import peewee
from peewee import *

class User_DB(peewee.Model):
    """
    ORM model of Users table
    """
    ID = peewee.IntField()
    username = peewee.CharField()
    password = peewee.CharField()

    class Meta:
        database = db

class Food_Pref(peewee.Model):
    ID = peewee.IntField()
    pref = peewee.CharField()

    class Meta:
        database = db
