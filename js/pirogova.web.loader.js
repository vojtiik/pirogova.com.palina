
(function ($, undefined) {
    $.widget("web.loader", {

        options: {
            max: 100
        },

        _create: function () {
            var localWidget = this;
            var $widget = this.element;

            localWidget._options = {
                baseContentDir: 'content/',
                baseConfigDir: 'config/',
                homeContent: 'home.html',
                fashionContent: 'fashion.html',
                portraitContent: 'portrait.html',
                aboutContent: 'about.html',
                $contentPageHolder: null,
                defaultImageHeight: 600,
                defaultImageWidth: 520,
                maxImageWidth: 975,
                defaultDebounce: 200

            };

            // insert content holder tag
            $widget.append('<div class="contentHolder" style="display: none;"></div>');
            localWidget._options.$contentPageHolder = $widget.children('.contentHolder');

            // review this should be in the widget/ or not dealth with here
            $('.goHome').click(function () {
                localWidget._loadHome();
            });
            $('.aboutLink').click(function () {
                localWidget._loadAbout();
            });

            // check the path for direct routing
            var hash = $(location).attr('hash').toLowerCase().substring(1);
            var queryS = localWidget._getParameterByName("show");
            
            if (hash == 'fashion' || queryS == 'fashion') {
                localWidget._loadFashion();
            } else if (hash == 'portrait' || hash == 'portraits' || queryS == 'portrait') {
                localWidget._loadPortrait();
            } else if (hash == 'about' || hash == 'contact' || queryS == 'about') {
                localWidget._loadAbout();
            } else {
                localWidget._loadHome();
            }
        },

        _getParameterByName: function (name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results == null)
                return "";
            else
                return decodeURIComponent(results[1].replace(/\+/g, " "));
        },


        _loadHome: function () {
            var methods = this;
            var _op = methods._options;
            _op.$contentPageHolder.load(_op.baseContentDir + _op.homeContent, function () {
                _op.$contentPageHolder.show(1000);
                methods._loadHomeSetEvents();
            });
        },

        _loadHomeSetEvents: function () {
            var methods = this;
            var _op = methods._options;

            var fashionLink = _op.$contentPageHolder.find('.fashionLink')
            fashionLink.click(function () {
                methods._loadFashion();
            });
            fashionLink.hover(function () {
                portraitLink.css('text-decoration', 'none');
                fashionLink.css('text-decoration', 'line-through');
            });

            var portraitLink = _op.$contentPageHolder.find('.portraitLink');
            portraitLink.click(function () {
                methods._loadPortrait();
            });
            portraitLink.hover(function () {
                fashionLink.css('text-decoration', 'none');
                portraitLink.css('text-decoration', 'line-through');
            });
        },

        _loadPortrait: function () {
            var methods = this;
            var _op = methods._options;

            // attach handler on gallery loaded
            _op.$contentPageHolder.on('galleryloaded', function () {
                // show it
                _op.$contentPageHolder.finish().show();
            });

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

        _loadFashion: function () {
            var methods = this;
            var _op = methods._options;

            // attach handler on gallery loaded
            _op.$contentPageHolder.on('galleryloaded', function () {
                // show it
                _op.$contentPageHolder.finish().show();
            });

            // hide current content 
            _op.$contentPageHolder.hide(500, function () {
                _op.$contentPageHolder.load(_op.baseContentDir + _op.fashionContent, function () {
                    // create gallery
                    methods._createSliderGallery(
                        _op.baseConfigDir + 'fashion',
                        'juiceboxFashion',
                        'juiceboxFashionCaption',
                        4)
                });
            });
        },

        _loadAbout: function () {
            var methods = this;
            var _op = methods._options;
            _op.$contentPageHolder.load(_op.baseContentDir + _op.aboutContent, function () {
                _op.$contentPageHolder.finish().show();
            });
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
            gallery.control.finish().fadeIn(200);

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