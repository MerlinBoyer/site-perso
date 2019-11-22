/*
 *
 *
 *
 */
deploySection(document.getElementById('sec1'));
deploySection(document.getElementById('sec2'));
deploySection(document.getElementById('sec3'));
deploySection(document.getElementById('sec4'));
deploySection(document.getElementById('sec5'));

function deploySection(div) {

    var children = div.children;
    var button = children[0].children[0];

    // first rotate button
    if (children[1].hidden) {
        button.style.transform = "rotate(90deg)";
    } else {
        button.style.transform = "rotate(0deg)";
    }

    // collapse/display all children but not the h2
    for (var i = 1; i < children.length; i++) {
        children[i].hidden = !children[i].hidden;
    }
}