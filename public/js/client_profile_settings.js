function empty(id) {
    var x = document.getElementById(id).value;
    if (x == "") {
        alert("Please enter a value.");
        return false;
    };
}

function existingInput() {
    var existing = document.getElementsByClassName("mdl-textfield__input");
    if (existing.length > 0) {
        alert("Please finish filling out previous forms.")
        return true;
    }
}

function inputOnClick(id, nme, txt) {
    if(!existingInput()) {
        curr = document.getElementById(id);
        currParent = curr.parentNode;

        form = document.createElement('form');
        div = document.createElement('div');
        input = document.createElement('input');
        label = document.createElement('label');
        button = document.createElement('button');

        form.action = "/profile";
        form.method = "post";

        div.className = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";

        input.className = "mdl-textfield__input";
        input.type = "text";
        input.id = "newInput"
        input.name = nme;

        label.className = "mdl-textfield__label";
        label.htmlFor = "newInput";
        //label.innerHTML = txt;

        button.type = "submit";
        button.className = "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent";
        button.innerHTML = "Save";

        div.appendChild(input);
        div.appendChild(label);
        form.appendChild(div);
        form.appendChild(button);

        currParent.removeChild(curr);
        currParent.appendChild(form);
    }
}
