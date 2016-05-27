import markup

items = ("Item one", "Item two", "Item three", "Item four")
paras = ("This was a fantastic list.", "And now for something completely different.")
images = ("thumb1.jpg", "thumb2.jpg", "more.jpg", "more2.jpg")

css1 = 'styles.css'

page = markup.page()
page.init( title="Meeting-Magic",
           css=(css1),
           header="Something at the top",
           footer="The bitter end." )

page.form(
    '"First name": <br> <input type="text" name="firstname"> <br> Last name:<br> <input type="text" name="lastname">',
    action='LINK TO SCRIPT FILE ADyags yfak OR MAYBE NEW HTML FILE',
    method='get'
    id='nameform'
)
page.form.close()

page.button(
    'Submit',
    type='submit',
    form='nameform',
    value='Submit'
)
page.button.close()

f = open('~/Meeting-Magic/Web/index.html', 'w')
f.write(page)
