
var images = document.getElementsByClassName('galleryImage');
var gallery = document.getElementById('scroll');
var isScrolled = false;

gallery.onscroll = function() {
     isScrolled = true;
};

function onWindowScroll() {
    if (isScrolled) {
        isScrolled = false;
        var scrollLeft = gallery.pageXOffset ? gallery.pageXOffset : gallery.scrollLeft ? gallery.scrollLeft : 0;
        for (var i = 0; i < images.length; i++)
            if (scrollLeft + document.documentElement.clientWidth - images[i].offsetLeft > 0)
                images[i].className = images[i].className.replace('lazyImg','');
    }
}

isScrolled = true;
setInterval(onWindowScroll, 100);

