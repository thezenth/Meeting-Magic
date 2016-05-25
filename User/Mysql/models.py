from peewee import *

database = MySQLDatabase('MeetingMagic', **{'password': '123noah123'})

class UnknownField(object):
    pass

class BaseModel(Model):
    class Meta:
        database = database

class User(BaseModel):
    food_pref = CharField(null=True)
    passwd = CharField(null=True)
    u = IntegerField(db_column='u_id', null=True)
    u_name = CharField(null=True)

    class Meta:
        db_table = 'User'

