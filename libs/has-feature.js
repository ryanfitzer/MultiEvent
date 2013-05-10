( function ( root, factory ) {

    if ( typeof define === 'function' && define.amd ) {

        define( factory );
    } else {
        
        root.detect = factory();
    }
    
}( this, function () {
    
    // Overly simplified. See https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
    // TODO: Replace with Modernizr.
    function hasTouch() {    
        if ( 'Modernizr' in window ) return Modernizr.touch;
        return ( ( 'ontouchstart' in window ) || window.DocumentTouch && document instanceof DocumentTouch );
    }

    // Overly simplified. See https://github.com/Modernizr/Modernizr/blob/master/src/isEventSupported.js
    // TODO: Replace with Modernizr.
    function hasEvent( name ) {
        return ( 'on' + name.toLowerCase() in document.documentElement );
    }

    return {
        hasTouch: hasTouch,
        hasEvent: hasEvent
    }
}));