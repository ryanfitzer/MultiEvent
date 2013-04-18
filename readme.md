# About

A tool that parses out which events are supported in the browser's environment and flags the input used (touch or mouse), as well as if that input matches the event type. This check for a match is needed due to some mouse events incorrectly firing with a touch input.

Give the [demo](http://ryanfitzer.github.io/MultiEvent/) a try.

## Behaviors

I've broken the events down onto behaviors: on, off, over, out. This covers the most basic interactions.

I'm not doing any checkeing for generic pointer events since IE is the only browser that supports them currently. That will need to change as more browsers implement pointer events.

Here's what events are supported in each bucket:

```js
var behaviors = {
    on: {
        pointer:    'MSPointerDown',
        touch:      'touchstart',
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
```

## Usage

Instantiate a behavior type:

```js
// returns and array of events  
var onMe = multiEvent( 'on' );
```

Setup the listener (jQuery is assumed):

```js
$( '#some-element' ).on( onMe.events.join( ' ' ), function( e ) {  
    
    // Make sure in hybrid enviroments that  
    // only the first event hanlder is called.  
    e.preventDefault();  
  
    // Tell our instance to generate the needed info about the event.  
    onMe.resolve( e );  
  
    // Flags for input sources  
    if ( onMe.isTouch ) {  
        alert( 'Input source was a touch!' );  
    }  
    else if ( onMe.isMouse ) {  
        alert( 'Input source was a mouse!' );  
    }  
  
    // Did the input source match the event that was fired?  
    // Certain mouse events will incorrectly fire when the   
    // input was a touch.  
    if ( onMe.isMatch ) {  
        alert( 'All is good!' );  
    }  
    else {  
        alert( 'I feel wonkey!' )  
    }  
});
```

## Sources

- [Modernizr.touch detects touch events not touch devices &middot; Issue #548 &middot; Modernizr/Modernizr &middot; GitHub](https://github.com/Modernizr/Modernizr/issues/548)

- [Touch And Mouse: Together Again For The First Time - HTML5 Rocks](http://www.html5rocks.com/en/mobile/touchandmouse/)

- [MSPointerEvent object (Internet Explorer)](http://msdn.microsoft.com/en-us/library/ie/hh772103.aspx)

- [pointerType property (Internet Explorer)](http://msdn.microsoft.com/en-us/library/ie/hh772359.aspx)

- [event.mozInputSource - Document Object Model (DOM) | MDN](https://developer.mozilla.org/en-US/docs/DOM/event.mozInputSource) 


## Roadmap

- [ ] [Add a test suite](https://github.com/ryanfitzer/MultiEvent/issues/1)
- [ ] [Add custom Modernizr build for detecting touch](https://github.com/ryanfitzer/MultiEvent/issues/2)
- [ ] [Convert to AMD](https://github.com/ryanfitzer/MultiEvent/issues/3)
- [ ] [Add "move" behavior](https://github.com/ryanfitzer/MultiEvent/issues/4)
- [ ] [Build out custom behaviors API](https://github.com/ryanfitzer/MultiEvent/issues/5)
- [ ] [Support both native and jQuery `event` objects to remove jQuery dependency](https://github.com/ryanfitzer/MultiEvent/issues/6)

