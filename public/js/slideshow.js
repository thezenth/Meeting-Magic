var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n, id1, id2) {
	document.getElementById(id1).value = parseInt(document.getElementById(id1).value) + n;
    document.getElementById(id2).value = parseInt(document.getElementById(id2).value) + n;
	showSlides(slideIndex += n);
}

function currentSlide(n) {
	showSlides(slideIndex = n);
}

function showSlides(n) {
	var i;
	var slides = document.getElementsByClassName("mySlides");
	var dots = document.getElementsByClassName("dot");
	if (n > slides.length) {
		slideIndex = 1
	}
	if (n < 1) {
		slideIndex = slides.length
	}
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
	}
	for (i = 0; i < dots.length; i++) {
		dots[i].className = dots[i].className.replace(" active", "");
	}
	slides[slideIndex - 1].style.display = "block";
	dots[slideIndex - 1].className += " active";
}

function updateFormInputs(id1, v1, id2, v2) {
	document.getElementById(id2).value = v2;
}
