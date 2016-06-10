function inputOnClick(id, nme, txt) {
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
