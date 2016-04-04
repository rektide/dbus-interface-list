var
  MethodType= require("dbus-native/lib/constants").messageType

/**
  Create a introspect call message
  @param destination the service to talk to
  @param path the path to ask for
*/
function introspect( destination, path){
	return {
		destination,
		path,
		interface:  "org.freedesktop.DBus.Introspectable",
		member: "Introspect",
		type: MethodType.methodCall
	}
}

module.exports= introspect
