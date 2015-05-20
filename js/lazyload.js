function getElementsByPartOfClassName(partOfClassName) {
    var allTags = document.getElementsByTagName("*");
    var res = [];
    for (var i = 0; i < allTags.length; i++)
        if (allTags[i].className && allTags[i].className.indexOf(partOfClassName) > -1)
            res.push(allTags[i]);
    return res;
}

// Collect all delay-loaded images in the document
lazyImages = getElementsByPartOfClassName("lazyImg");

var isScrolled = false;
window.onscroll = function () { isScrolled = true; };

function onWindowScroll() {
    if (isScrolled) {
        isScrolled = false;
         var scrollLeft = window.pageOffset ? window.pageXOffset : window.scrollLeft ? window.scrollLeft : 0;
        for (var i = 0; i < lazyImages.length; i++)
            if (scrollLeft + document.documentElement.clientWidth - lazyImages[i].offsetLeft > 0)
                lazyImages[i].className = lazyImages[i].className.replace("lazyImg");
    }
}

setInterval(onWindowScroll, 100);