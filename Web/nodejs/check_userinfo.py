import json
import user_classes
from pymysql import read_db as rdb
from py_node import tell_node


#Read data.json for recieved username and password
f = open('data.json', 'r')
f_str = f.read()
parsed = json.loads(f_str)
output = parsed[1]
allUsers = output['userInfo']
currUser = allUsers[0]
username = currUser['username']
password = currUser['password']

usr = rdb.read_user(
    username,
    make_new=True,
    new_pwd=password
)
print ("HELLO")
tell_node(usr.__repr__())
