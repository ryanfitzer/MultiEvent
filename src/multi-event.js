/*jshint laxcomma:true, asi:true */
( function ( root, factory ) {

    if ( typeof define === 'function' && define.amd ) {

        define([
            '../libs/has-feature',
            '../libs/array.ForEach',
            '../libs/array.isArray'
        ], factory );
    } else {

        root.multiEvent = factory( root.detect );
    }
    
}( this, function ( detect ) {

    var debug = false;

    var behaviors = {
        on: {
            pointer:    'MSPointerDown',
            touch:      'touchstart',
            // Why not mousedown? FF on Win8 fires a both the touchstart and mousedown events. 
            // Not so when when the click event is used. Event.preventDefault does
            // not fix the issue.
            mouse:      'click'
        },
        off: {
            pointer:    'MSPointerUp',
            touch:      'touchend',
            mouse:      'mouseup'
        },
        over: {
            pointer:    'MSPointerOver',
            mouse:      'mouseover'
        },
        out: {
            pointer:    'MSPointerOut',
            mouse:      'mouseout'
        }
    }

    function log() {

        if ( debug ) console.log( arguments );
    }

    /**
     * Provide the proper event(s) for the current environment. Make sure to use `event#preventDefault` in the handlers to prevent multiple events from firing in hybrid enviroments.
     * @param type {String|Object} Event type string or event types object
     * @returns {Array} Supported events types
     */
    function resolveEvents( types ) {

        var events = []
            , hasPointer = window.navigator.msPointerEnabled
            ;

        var push = function( eventTypes ) {

            eventTypes = eventTypes.isArray ? eventTypes : [ eventTypes ];
    
            eventTypes.forEach( function( item ) {
                events.push( item );
            });
            return events;
        }

        // Return only the pointers, if supported.
        if ( types.pointer && hasPointer ) return push( types.pointer );

        if ( types.touch && detect.hasTouch ) push( types.touch );

        if ( types.mouse ) {
            if ( !types.mouse.isArray && detect.hasEvent( types.mouse ) ) events.push( types.mouse );
            else {
                types.mouse.forEach( function( item ) {
                    if ( detect.hasEvent( item ) ) events.push( item );
                });
            }
        }

        return events;
    }

    function MultiEvent( type, isDebug ) {

        debug = isDebug;

        // Did they supply their own types object?
        if ( typeof type === 'object' ) {
            this.types = type;
            this.behavior = 'custom';
        }
        else {
            this.types = behaviors[ type ];
            this.behavior = type;
        }

        this.events = resolveEvents( this.types );

        return this;
    }

    MultiEvent.prototype = {

        /**
         * Determine the event source.
         * @param evt {Object} The event object (can also be a jQuery event object).
         * @returns {Object} An object of source types with boolean values
         */
        resolve: function( evt ) {

            var types = this.types
                , evtType = evt.type
                , origEvent = evt.originalEvent || evt
                ;
    
            // http://msdn.microsoft.com/en-us/library/ie/hh772103.aspx
            var msSrc = origEvent.pointerType
                , msTouch = origEvent.MSPOINTER_TYPE_TOUCH
                , msMouse = origEvent.MSPOINTER_TYPE_MOUSE
                ;
        
            // https://developer.mozilla.org/en-US/docs/DOM/event.mozInputSource
            var mozSrc = origEvent.mozInputSource
                , mozTouch = origEvent.MOZ_SOURCE_TOUCH
                , mozMouse = origEvent.MOZ_SOURCE_MOUSE
                ;
    
            this.isMatch = true;
            this.isTouch = false;
            this.isMouse = false;
    
            switch( evtType ) {
        
                case types.pointer:
    
                    log( 'switch case: pointer; event: ', types.pointer );
                    if ( msSrc === msTouch ) this.isTouch = true;
                    if ( msSrc === msMouse ) this.isMouse = true;
                    break;
        
                case types.touch:
    
                    log( 'switch case: types.touch' );
                    this.isTouch = true;
                    break;
    
                case types.mouse:
    
                    log( 'switch case: mouse; event: ', types.mouse );
                    // `mozSrc` can be `0` when the source could not be 
                    // determined. If that's the case, default to `source.mouse`
                    if ( mozSrc ) {
                        log('entered mozSrc');
                
                        if ( mozSrc === mozTouch ) {
                            this.isTouch = true;
                            this.isMatch = false;
                        }
                
                        if ( mozSrc === mozMouse ) this.isMouse = true;
                
                        break;
                    }
                    else if ( types.mouse === 'mouseover' || types.mouse === 'mouseout' ) {
        
                        // Not perfect, but Chrome on Win8 and IOS can fire these 
                        // events when touched. If it's a mouse, these values are 
                        // non-zero 99.99% of the time and the event continuosly fires.
                        // With a touch event on IOS, these will be undefined.
                        // TODO: Test iPad with mouse.
                        if ( 'webkitMovementX' in origEvent ) {
                    
                            log( 'entered webkitMovementX' );
                    
                            if ( !origEvent.webkitMovementX && !origEvent.webkitMovementY ) {
                        
                                this.isTouch = true;
                                this.isMatch = false;
                                break;
                            }
                        }
                    }
        
                default:
    
                    log( 'switch case: default; event: ', evtType );
                    this.isMouse = true;
                    break;
            }
    
            return this;
        }
    }

    return function( type ) {

        return new MultiEvent( type );
    }
    
}));