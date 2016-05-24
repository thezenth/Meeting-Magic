# -- FOR SETUP ON NEW MACHINE -- #
# Also testing

# -- peewee -- #
import peewee
from peewee import *

class Users(peewee.Model):
    """
    ORM model of Users table
    """
    ID = peewee.IntField()
    username = peewee.CharField()
    password = peewee.CharField()

    # foodprefs = peewee.ForeignKeyField(foodprefs) <-- how to do a list...

    class Meta:
        database = database
