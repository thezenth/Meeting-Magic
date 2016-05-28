#import sys
#print ("<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>")
#sys.stdout.flush()
import json
import sys

f = open('data.json', 'r')
f_str = f.read()
parsed = json.loads(f_str)
output = parsed[1]
allUsers = output['userInfo']
print ("# -- PYTHON -- #")
print ("USERNAME: " + allUsers[0]['username'])
print ("PASSWORD: " + allUsers[0]['password'])
sys.stdout.flush()


"""
stuff = json.dumps(
    [
        {
            "_comment": "INPUT",
            "bar": [
                "baz",
                None,
                1.0,
                2
            ]
        },
        {
            "_comment": "OUTPUT"
        }
    ],
    indent=4
)

f = open('data.json', 'w')
f.write(stuff)
f.close()
"""
