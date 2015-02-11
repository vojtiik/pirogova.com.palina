
(function ($, undefined) {
    $.widget("web.loader", {

        options: {
          value : null
        },

        _create: function (galleryname) {
            var localWidget = this;
            var $widget = this.element;
            localWidget._options = {
                baseContentDir: 'content/',
                baseConfigDir: 'config/',
                $contentPageHolder: null,
                defaultImageHeight: 600,
                defaultImageWidth: 520,
                maxImageWidth: 975,
                defaultDebounce: 200

            };

            // insert content holder tag
            localWidget._options.$contentPageHolder = $widget.children('.gallery');

            // attach handler on gallery loaded
            localWidget._options.$contentPageHolder.on('galleryloaded', function () {
                // show it
                localWidget._options.$contentPageHolder.finish().show();
            });

            if (this.options.value == "fashion") this._loadFashion();
            if (this.options.value == "portrait") this._loadPortrait();
        },

      

        _loadFashion: function () {
            var methods = this;
            var _op = methods._options;
            _op.$contentPageHolder.hide(500, function () {
                methods._createSliderGallery(
                    _op.baseConfigDir + 'fashion',
                    'juiceboxFashion',
                    'juiceboxFashionCaption',
                    4);
            });
        },


        _loadPortrait: function () {
            var methods = this;
            var _op = methods._options;

            // hide current content 
            _op.$contentPageHolder.hide(500, function () {
                _op.$contentPageHolder.load(_op.baseContentDir + _op.portraitContent, function () {

                    // create gallery
                    methods._createSliderGallery(
                        _op.baseConfigDir + 'portraits',
                        'juiceboxPortrait',
                        'juiceboxPortraitCaption',
                        4);
                });
            });
        },

        _loadAbout: function () {
            var methods = this;
            var _op = methods._options;

        },

        _createSliderGallery: function (configname, galleryName, captionName, galleryCount) {
            var methods = this;
            var _op = methods._options;

            var galleryArray = new Array();
            var captionArray = new Array();
            for (i = 0; i < galleryCount; i++) {
                var confignameUrl = configname + i + '.xml';
                var galleryInnitCount = 0;

                var juice = new juicebox({
                    containerId: galleryName + i,
                    galleryWidth: _op.defaultImageWidth + "px",
                    galleryHeight: _op.defaultImageHeight + "px",
                    configUrl: confignameUrl,
                    backgroundColor: "rgba(255,255,255,1)",
                    showPreloader: false
                });

                juice.onInitComplete = function () {
                    galleryInnitCount = galleryInnitCount + 1;
                    if (galleryInnitCount == galleryCount) {
                        methods._galleriesInnitialized(galleryArray, captionArray, galleryCount);
                    }
                }

                galleryArray[i] = {
                    gallery: juice,
                    control: _op.$contentPageHolder.find('.galleryWrapper').find('#' + galleryName + i)
                };

                captionArray[i] = $('#' + captionName + i);
            }
        },

        _galleriesInnitialized: function (galleryArray, captionArray, galleryCount) {
            var methods = this;
            var _op = methods._options;

            var gallerySize = galleryArray[0].gallery.getImageCount();

            // fix gallery width for fist images
            for (i = 0; i < galleryCount; i++) {
                methods._fixGalleryWidth(galleryArray[i], i + 1, captionArray[i]);
            }

            // bind gallery controls
            // remove touch nav features from the juice galleries
            _op.$contentPageHolder.find('.jbn-nav-touch-area').remove();
            _op.$contentPageHolder.find('.jb-navigation').remove();

            if (jQuery.browser.mobile || navigator.userAgent.match(/iPad/i) != null) {
                var wrapper = _op.$contentPageHolder.find('.galleryWrapper')[0];

                var hammered = Hammer(wrapper);

                hammered.on('swipeleft', $.debounce(function () {
                    methods._moveRight(galleryArray, gallerySize, captionArray);
                }, _op.defaultDebounce));

                hammered.on('swiperight', $.debounce(function () {
                    methods._moveLeft(galleryArray, gallerySize, captionArray);
                }, _op.defaultDebounce));
            }
            else {

                // bind click on div scrolling
                _op.$contentPageHolder.find('.scrollright').click($.debounce(function () {
                    methods._moveRight(galleryArray, gallerySize, captionArray);
                }, _op.defaultDebounce));
                _op.$contentPageHolder.find('.scrollleft').click($.debounce(function () {
                    methods._moveLeft(galleryArray, gallerySize, captionArray);
                }, _op.defaultDebounce));

                // add mouse scroll
                _op.$contentPageHolder.find('.galleryWrapper').bind('mousewheel DOMMouseScroll', $.debounce(function (event) {
                    var delta = event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0 ? 1 : -1;
                    if (delta > 0) {
                        //up                      
                        methods._moveRight(galleryArray, gallerySize, captionArray);
                    } else {
                        // down
                        methods._moveLeft(galleryArray, gallerySize, captionArray);
                    }
                    return false;
                }, _op.defaultDebounce));
            }

            // and we done, let everyone know
            _op.$contentPageHolder.trigger('galleryloaded', 1);
        },

        _moveRight: function (galleryArray, gallerySize, captionArray) {
            var methods = this;
            var _op = methods._options;

            var galleryCount = galleryArray.length;
            var firstGalleryNext = galleryArray[0].gallery.getImageIndex() + 1;

            for (i = 0; i < galleryCount; i++) {
                methods._fixGalleryWidth(galleryArray[i], methods._getNextImageIndex(firstGalleryNext, i, gallerySize), captionArray[i]);
                galleryArray[i].gallery.showNextImage();
            }
        },

        _moveLeft: function (galleryArray, gallerySize, captionArray) {
            var methods = this;
            var _op = methods._options;

            var firstGalleryprevious = galleryArray[0].gallery.getImageIndex() - 1;
            var galleryCount = galleryArray.length;

            for (i = 0; i < galleryArray.length; i++) {
                methods._fixGalleryWidth(galleryArray[i], methods._getPreviousImageIndex(firstGalleryprevious, i, gallerySize), captionArray[i]);
                galleryArray[i].gallery.showPreviousImage();
            }
        },

        _getPreviousImageIndex: function (firstGalleryPrevious, galleryIndex, gallerySize) {
            var methods = this;
            var _op = methods._options;

            if (firstGalleryPrevious == 0) {
                firstGalleryPrevious = gallerySize;
            }
            var next = firstGalleryPrevious + galleryIndex;
            if (next > gallerySize) {
                return next - gallerySize;
            } else {
                return next;
            }
        },

        _getNextImageIndex: function (firstGalleryNext, galleryIndex, gallerySize) {
            var methods = this;
            var _op = methods._options;

            if (firstGalleryNext == (gallerySize + 1)) {
                firstGalleryNext = 1;
            }
            var next = firstGalleryNext + galleryIndex;
            if (next > gallerySize) {
                return next - gallerySize;
            } else {
                return next;
            }
        },

        _fixGalleryWidth: function (gallery, imageIndex, caption) {
            var methods = this;
            var _op = methods._options;

            // fix gallery width
            var imageinfo = gallery.gallery.getImageInfo(imageIndex);
            var width = imageinfo.title;

            if (isNaN(width)) {
                width = _op.defaultImageWidth;
            }

            gallery.control.hide();
            gallery.gallery.setGallerySize(width, _op.defaultImageHeight);
            gallery.control.finish().fadeIn(800);

            // set gallery caption width and text
            methods._updateCaptionControl(caption, imageinfo.caption, width);
        },

        _updateCaptionControl: function (caption, text, galleryWidth) {
            var methods = this;
            var _op = methods._options;
            caption.css('width', galleryWidth + 'px');
            caption.css('min-width', galleryWidth + 'px');
            caption.hide();

            if (text == '') {
                caption.html('&nbsp;');
            } else {
                caption.text(text);
            }

            caption.fadeIn();
        },

        _setOptions: function (options) {
            this._super(key, value);
        },

        _destroy: function () {
            return this._super();
        }
    });

})(jQuery);