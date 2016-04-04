var
  MessageType= require("dbus-native/lib/constants").messageType

function hello(){
	return {
		path:'/org/freedesktop/DBus',
		destination: 'org.freedesktop.DBus',
		'interface': 'org.freedesktop.DBus',
		member: 'Hello',
		type: MessageType.methodCall
	}
}

module.exports= hello
