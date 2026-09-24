let leaf = document.getElementById("leaf");

window.addEventListener("scroll", function() {

    let scrollPosition = window.scrollY;

    let move = scrollPosition * 0.25;

    leaf.style.transform = "translateX(" + move + "px) rotate(" + scrollPosition / 8 + "deg)";

});