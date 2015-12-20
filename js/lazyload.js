var images = document.getElementsByClassName('galleryImage');
var gallery = document.getElementById('scroll');
var isScrolled = true;
var defaultIntervals = [1000, 5000, 10000, 50000]

gallery.onscroll = function() {
  isScrolled = true;
};

function onWindowScroll() {
  if (isScrolled) {
    isScrolled = false;
    var scrollLeft = gallery.pageXOffset ? gallery.pageXOffset : gallery.scrollLeft ? gallery.scrollLeft : 0;
    for (var i = 0; i < images.length; i++) {
      if (scrollLeft + document.documentElement.clientWidth - images[i].offsetLeft > 0) {
        images[i].className = images[i].className.replace('lazyImg', '');
      }
    }
  }
}

function onTimerScroll() {
  if ((gallery.pageXOffset ? gallery.scrollLeft : gallery.scrollLeft) % 150 == 0) {
    gallery.scrollLeft += 150;
    var scrollLeft = gallery.pageXOffset ? gallery.pageXOffset : gallery.scrollLeft ? gallery.scrollLeft : 0;
    for (var i = 0; i < images.length; i++) {
      if (scrollLeft + document.documentElement.clientWidth - images[i].offsetLeft > 0) {
        images[i].className = images[i].className.replace('lazyImg', '');
      }
    }
  }
}

setInterval(onWindowScroll, 100);
setInterval(onTimerScroll, 3000);
