var
  _u31= Math.pow(2,15),
  _random= ()=> Math.floor( _u31* Math.random())

/**
  Messager is an reply-response helper for the dbus-native low level messaging interfaces.
  @param bus the low level DBus bus connection
  @returns a function to send a message, returning a promise for the message reply.
*/
function Messager( busConnection){
	var pending= {}
	busConnection.on( "message", function( msg){
		// find serial
		if( !msg.replySerial) return
		var defer= pending[ msg.replySerial]
		if( !defer) return

		// resolve 
		defer.resolve( msg)
	})

	return function message( m){
		var serial= m.serial|| _random()
		if( !m.serial){
			m.serial= serial
		}
		// create deferred
		var defer= pending[ serial]= Promise.defer()

		// cleanup `pending` after message resolves
		function cleanup(){
			delete pending[ serial]
		}
		defer.promise.then(cleanup, cleanup)

		// send message
		busConnection.message( m)

		// return
		return defer.promise
	}
}

module.exports= Messager
