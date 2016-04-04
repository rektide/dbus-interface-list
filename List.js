var
  introspect= require("./msg/introspect"),
  Messager= require("./Messager"),
  rxjs= require("rxjs"),
  xml2js= require("es6-promisify")(require("xml2js").parseString)

function List( busConnection, destination){
	var
	  messager= Messager( busConnection),
	  subject= rxjs.BehaviorSubject()
	return rxjs.Observable.create(function( observer){
		function explore(introspection, path){
		}
		function ask( path){
			var
			  msg= introspect( destination, path),
			  reply= messager(msg),
			  process= reply.then(function( m){
				var
				  str= m.body[0],
				  introspection= xml2js(str),
				  named= introspection.then(function(introspect){
					// fire off followups
					var done= explore(path, introspect)

					// publish result
					var result= [path, introspect]
					observer.next(result)

					// return when followups finish
					return done && Promise.all(done) && true
				  })
			})
			return process
		}
		var root= ask( "/")
		root.catch(observer.error)
	})
}

module.exports= List
