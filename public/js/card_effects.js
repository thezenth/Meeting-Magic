function expand(obj) {
    parent = obj.parentNode.parentNode.parentNode;
    parent.style.pixelHeight += 40;
    console.log(parent.id);

    children = parent.childNodes;
    console.log(children);
    for(i = 0;i < children.length; i++) {
        children[i].style.pixelHeight += 40;
    }
}
