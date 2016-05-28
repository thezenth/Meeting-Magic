
import json
import sys

def tell_node(msg, ident="DEBUG"): #Identifier is used to parse; i.e. node checks for a list of identifiers, and if not DEBUG, then does something accordingly
    print ("# -- PYTHON -- #")
    print (ident + ":" + msg)
"""
print ("# -- PYTHON -- #")
print ("USERNAME: " + allUsers[0]['username'])
print ("PASSWORD: " + allUsers[0]['password'])
"""

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

"""
import sys
print ("<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>")
sys.stdout.flush()
"""
