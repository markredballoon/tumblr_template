/*
========    General JS    ========

These are some general JS functions that should be included with the site.
They make development easier.
Mostly taken from rb_clean

*/

// Custom events.
// Fire the custom events 60 times a second, if they are required.
// This is a more efficient way of using scroll or resize events.
var intervalID = setInterval( function() {
    if ( $window.scrollTop() !== scrollPos ){
        scrollPos = $window.scrollTop();
        $events.trigger('custom:scroll');
    };
    if ( $window.width() !== windowWidth ){
        windowWidth = $window.width();
        $events.trigger('custom:resize');
    }
}, 1000/60);

var currentScreenSize   = 'lg',
    $window             = $(window),
    $main               = $('main'),
    scrollPos           = -1,
    windowWidth         = $window.width(),
    eventObject         = { info: 'This object is used to trigger custom events on the page.'},
    $events             = $(eventObject);

function checkScreenSize(target){
    $target = target;
    if ( $target.find('.visible-xs').css('display') === 'block' ){
        currentScreenSize = 'xs';
    }
    else if ( $target.find('.visible-sm').css('display') === 'block' ){
        currentScreenSize = 'sm';
    }
    else if ( $target.find('.visible-md').css('display') === 'block' ){
        currentScreenSize = 'md';
    }
    else{
        currentScreenSize = 'lg';
    }
}



function isPropertySupported(property){
    // Returns true if propery is supported
    return property in document.body.style;
}

// Fallback for if object fit isn't supported (IE and Edge)
function obFitFB(){
    if (! isPropertySupported('object-fit') ){
        $('body').addClass('no-object-fit');
        // This class is added to the body. Any instances where no-object fit is used should have a fallback also created. Creating a new element that has a background-image the same as the image source with the correct background-size attribute would be a more comprehensive solution but there are a lot of complications with using this and it won't work for users who have js disabled.

        // Fallback for the hero image:
        var $objectFit = $('img.object-fit , .tag-index .object-fit-wrap img.make-square:first-child');
        if ($objectFit.length > 0) {
            $objectFit.each(function(index, el) {
                var imgSrc = $(this)[0].src;
                var $parentEle = $(this).parent();
                var obfitPosition = $(this).css('object-position');
                var obfitSize = $(this).css('object-fit');

                obfitPosition = typeof obfitPosition !== 'undefined' && obfitPosition.length > 1 ? obfitPosition : 'center';
                obfitSize = typeof obfitSize !== 'undefined' && obfitSize.length > 1 ? obfitSize : 'cover';

                $(this).css('visibility', 'hidden').removeClass('object-fit');
                
                $parentEle.css({
                    'background-image':'url('+imgSrc+')',
                    'background-size':obfitSize,
                    'background-position':obfitPosition,
                    'display': 'block'
                }).removeClass('object-fit-wrap');
            });
        };
    };
}


(function($){
    $events.on('custom:resize', function(){
        checkScreenSize( $('#bs-size-check') );
    });
})(jQuery);