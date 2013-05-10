require( [ '../src/multi-event' ], function( multiEvent ) {

     var onMe = multiEvent( 'on' )
         , offMe = multiEvent( 'off' )
         , overMe = multiEvent( 'over' )
         , outMe = multiEvent( 'out' )
         ;
    
     var results = $( '#results' )
         , logEvent = $( '#event span' )
         , logInput = $( '#input span' )
         , logMatch = $( '#match span' )
         ;

     var logger = function( e, obj ) {

         var origEvt = e.originalEvent || e
             , parent = $( e.target ).parent()
             ;
    
         e.preventDefault();
         obj.resolve( e );
    
         results.appendTo( parent );
    
         logEvent.html( origEvt.type );
    
         if ( obj.isTouch ) logInput.html( 'touch' );
         else logInput.html( 'mouse' );
    
         if ( obj.isMatch ) {
             logMatch.html( 'True' );
             logMatch.css( 'color', 'green' );
         }
         else {
             logMatch.html( 'False' );
             logMatch.css( 'color', 'red' );
         }
    
         results.show();
    
         console.log( 'event type:', e.type );
         console.log( 'original event:', origEvt.type );
         console.log( 'isTouch:', obj.isTouch );
         console.log( 'isMouse:', obj.isMouse );
         console.log( 'isMatch:', obj.isMatch );
         console.log( 'changedTouches', origEvt.changedTouches )
         console.log( 'pointerType:', origEvt.pointerType );
         console.log( 'mozInputSource:', origEvt.mozInputSource );
         console.log( 'webkitMovementX:', origEvt.webkitMovementX );
         console.log( 'webkitMovementY:', origEvt.webkitMovementY );
         console.log( obj );
         console.log( e );
         console.log( '------' );
     }

     $( '#on .target' ).on( onMe.events.join( ' ' ), function( e ) { logger( e, onMe ) } ); 
     $( '#off .target' ).on( offMe.events.join( ' ' ), function( e ) { logger( e, offMe ) } ); 
     $( '#over .target' ).on( overMe.events.join( ' ' ), function( e ) { logger( e, overMe ) } ); 
     $( '#out .target' ).on( outMe.events.join( ' ' ), function( e ) { logger( e, outMe ) } );
});