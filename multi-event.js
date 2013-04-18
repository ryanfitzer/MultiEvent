/*!
 * MultiEvent 0.5.0 | Copyright (c) 2013 Ryan Fitzer
 * License: (http://www.opensource.org/licenses/mit-license.php)
 */
/*jshint laxcomma:true, asi:true */
(function() {
    
    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
    // Production steps of ECMA-262, Edition 5, 15.4.4.18
    // Reference: http://es5.github.com/#x15.4.4.18
    if ( !Array.prototype.forEach ) {
        Array.prototype.forEach = function forEach( callback, thisArg ) {
 
            var T, k;
 
            if ( this == null ) {
                throw new TypeError( "this is null or not defined" );
            }
 
            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            var O = Object(this);
 
            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0; // Hack to convert O.length to a UInt32
 
            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if ( {}.toString.call(callback) !== "[object Function]" ) {
                throw new TypeError( callback + " is not a function" );
            }
 
            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if ( thisArg ) {
                T = thisArg;
            }
 
            // 6. Let k be 0
            k = 0;
 
            // 7. Repeat, while k < len
            while( k < len ) {
                
                var kValue;
 
                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if ( Object.prototype.hasOwnProperty.call(O, k) ) {
 
                    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                    kValue = O[ k ];
     
                    // ii. Call the Call internal method of callback with T as the this value and
                    // argument list containing kValue, k, and O.
                    callback.call( T, kValue, k, O );
                }
                // d. Increase k by 1.
                k++;
            }
            // 8. return undefined
        };
    }
    
    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/isArray
    if( !Array.isArray ) {
        Array.isArray = function ( vArg ) {
            return Object.prototype.toString.call( vArg ) === "[object Array]";
        };
    }
    
    var debug = false;
    
    var behaviors = {
        on: {
            pointer:    'MSPointerDown',
            touch:      'touchstart',
            // Why not mousedown? FF on Win8 fires a both the touchstart and mousedown events, 
            // but only the touchstart when the click event is used. Event.preventDefault does
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
    
    function hasTouch() {
        
        // TODO Use a cutom Modernizr build
        if ( 'Modernizr' in window ) return Modernizr.touch;
        return ( ( 'ontouchstart' in window ) || window.DocumentTouch && document instanceof DocumentTouch );
    }
    
    // Overly simplified. See https://github.com/Modernizr/Modernizr/blob/master/src/isEventSupported.js
    // TODO: After AMD is implemented, replace with Modernizr.
    function hasEvent( name ) {
        return ( 'on' + name.toLowerCase() in document.documentElement );
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
        
        if ( types.touch && hasTouch ) push( types.touch );
        
        if ( types.mouse ) {
            if ( !types.mouse.isArray && hasEvent( types.mouse ) ) events.push( types.mouse );
            else {
                types.mouse.forEach( function( item ) {
                    if ( hasEvent( item ) ) events.push( item );
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
         * @param evt {Object} A jQuery event object.
         * @returns {Object} An object of source types with boolean values
         */
        resolve: function( evt ) {

            var types = this.types
                , evtType = evt.type
                , origEvent = evt.originalEvent
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

    window.multiEvent = function( type ) {
    
        return new MultiEvent( type );
    }

})();
