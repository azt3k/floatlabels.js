/**
 * FloatLabels
 * URL: http://clubdesign.github.io/floatlabels.js/
 * Author: Marcus Pohorely ( http://www.clubdesign.at )
 * Copyright: Copyright 2013 / 2014 http://www.clubdesign.at
 *
 * Adapted for bootstrap projects by Michael Levin 2/20/14
 */

;
(function($, window, document, undefined) {
    var pluginName = "floatlabel",
        cssField = null,
        cssFieldActive = null,
        cssActive = null,
        cssFocus = null,
        css = null,
        defaults = {
            transitionDuration: 0.1,
            transitionEasing: 'ease-in-out',
            labelClass: '',
            alwaysDisplay: false,
            typeMatches: /text|password|email|number|search|url|tel/,
            css: {
                'position': 'absolute',
                'color': '#838780',
                'background-color': 'transparent',
                '-moz-opacity': '0',
                '-khtml-opacity': '0',
                '-webkit-opacity': '0',
                'opacity': '0'
            },
            cssActive: {
                '-moz-opacity': '1',
                '-khtml-opacity': '1',
                '-webkit-opacity': '1',
                'opacity': '1'
            },
            cssFocus: {
                color: '#2996cc'
            },
            cssField: {
            },
            cssFieldActive: {
            },
        };

    function Plugin(element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);
        this.init();
    }
    Plugin.prototype = {
        init: function() {

            // Set Vars
            var self = this,
                settings = this.settings,
                transDuration = settings.transitionDuration,
                transEasing = settings.transitionEasing,
                $elem = this.$element,
                elementID = $elem.attr('id'),
                placeholderText = $elem.attr('placeholder'),
                floatingText = $elem.data('label'),
                extraClasses = $elem.data('class')
                animationCss = {
                    '-webkit-transition': 'all ' + transDuration + 's ' + transEasing,
                    '-moz-transition': 'all ' + transDuration + 's ' + transEasing,
                    '-o-transition': 'all ' + transDuration + 's ' + transEasing,
                    '-ms-transition': 'all ' + transDuration + 's ' + transEasing,
                    'transition': 'all ' + transDuration + 's ' + transEasing
                }

            // Validate
            if ($elem.prop('tagName').toUpperCase() !== 'INPUT' &&
                $elem.prop('tagName').toUpperCase() !== 'TEXTAREA' &&
                $elem.prop('tagName').toUpperCase() !== 'SELECT') {
                return;
            }
            if ($elem.prop('tagName').toUpperCase() == 'INPUT' &&
                !settings.typeMatches.test($elem.attr('type'))) {
                return;
            }

            // Create an ID if there isn't one
            if (!elementID) {
                while (!elementID || $('#' + elementID).length) {
                    elementID = Math.floor(Math.random() * 1000) + 1;
                }
                $elem.attr('id', elementID);
            }

            // do some saity checks
            if (!extraClasses)
                extraClasses = '';

            if (!placeholderText || placeholderText === '')
                placeholderText = "You forgot to add placeholder attribute!";

            if (!floatingText || floatingText === '')
                floatingText = placeholderText;

            // deal to the markup
            $elem.wrap('<div class="floatlabel-wrapper" style="position:relative"></div>');
            $elem.before('<label for="' + elementID + '" class="label-floatlabel ' + settings.labelClass + ' ' + extraClasses + '">' + floatingText + '</label>');
            this.$label = $elem.prev('label');

            // Compile and apply the base css
            this.$label.css(this.cssConf());
            this.$element.css(this.cssConf('field'));

            // Check Value on event
            $elem.on('keyup blur change', function(e) {
                self.checkValue(e);
            });

            // Blur Callback
            $elem.on('blur', function() {
                var css = $elem.is('.active-floatlabel') ? settings.cssActive : settings.css;
                $elem.prev('label').css(css);
            });

            // Focus Callback
            $elem.on('focus', function() {
                $elem.prev('label').css(settings.cssFocus);
            });

            // set transitions
            self.$label.css(animationCss);
            self.$element.css(animationCss);

            this.checkValue();
        },
        cssConf: function(type) {

            var $elem = this.$element;
            var $label = $elem.prev('label');

            if (type == 'active') {

                // Active State Label CSS
                if (!cssActive) {
                    cssActive = $.extend({}, {

                    }, this.settings.cssActive);
                }
                return cssActive;

            } else if (type == 'field') {

                // Initial State Label CSS
                if (!cssField) {
                    cssField = $.extend({}, {

                    }, this.settings.cssField);
                }
                return cssField;

            } else if (type == 'field-active') {

                // Initial State Label CSS
                if (!cssFieldActive) {
                    cssFieldActive = $.extend({}, {
                        'padding-top': parseInt($elem.css('padding-top')) + $label.height(),
                    }, this.settings.cssFieldActive);
                }
                return cssFieldActive;

            } else if (type == 'focus') {

                // Initial State Label CSS
                if (!cssFocus) {
                    cssFocus = $.extend({}, {

                    }, this.settings.cssFocus);
                }
                return cssFocus;

            } else {

                // Initial State Label CSS
                if (!css) {
                    css = $.extend({}, {
                        'top': $elem.css('padding-top'),
                        'left': $elem.css('padding-left'),
                        'font-size': $elem.css('font-size'),
                        'font-weight': $elem.css('font-weight'),
                        'color': $elem.css('color'),
                        'background-color': $elem.css('background-color'),
                        'display':'none'
                    }, this.settings.css);
                }
                return css;

            }
        },
        checkValue: function(e) {

            if (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode === 9) {
                    return;
                }
            }

            var $elem = this.$element,
                currentFlout = $elem.data('flout');

            if ($elem.val() !== "")
                $elem.data('flout', '1');

            if ($elem.val() === "")
                $elem.data('flout', '0');

            if ($elem.data('flout') === '1' && currentFlout !== '1')
                this.showLabel();

            if (
                $elem.data('flout') === '0' &&
                currentFlout !== '0' && (
                    $elem.prop('tagName').toUpperCase() !== 'SELECT' ||
                    (
                        $elem.prop('tagName').toUpperCase() === 'SELECT' &&
                        !this.settings.alwaysDisplayOnSelect
                    )
                )
            )
                this.hideLabel();

        },
        showLabel: function() {
            var self = this;
            self.$label.css({'display': 'block'});
            window.setTimeout(function() {
                self.$label.css(self.cssConf('active'));
                self.$element.css(self.cssConf('field-active')).addClass('active-floatlabel');
            }, 50);
        },
        hideLabel: function() {
            var self = this;
            self.$label.css(self.cssConf());
            self.$element.css(self.cssConf('field')).removeClass('active-floatlabel');
            window.setTimeout(function() {
                self.$label.css({'display': 'none'});
            }, self.settings.transitionDuration * 1000);
        }
    };
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };
})(jQuery, window, document);
