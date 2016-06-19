function empty(id) {
	var x = document.getElementById(id).value;
	if (x == "") {
		alert("Please enter a value.");
		return false;
	};
}

function existingInput() {
	if (document.getElementById("newInput")) {
		alert("Please finish filling out previous forms.")
		return true;
	}
}

function inputOnClick(id, nme, txt) {
	if (!existingInput()) {
		curr = document.getElementById(id);
		currParent = curr.parentNode;

		form = document.createElement('form');
		div = document.createElement('div');
		input = document.createElement('input');
		label = document.createElement('label');
		button = document.createElement('button');

		form.action = "/profile";
		form.method = "post";

		input.type = "text";
		input.id = "newInput"
		input.name = nme;

		label.htmlFor = "newInput";
		//label.innerHTML = txt;

		button.type = "submit";
		button.className = "waves-effect waves-light btn"
		button.innerHTML = "Save";

		div.appendChild(input);
		div.appendChild(label);
		form.appendChild(div);
		form.appendChild(button);

		currParent.removeChild(curr);
		currParent.appendChild(form);
	}
}
