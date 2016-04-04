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
		function consider( reply){
			observer.next(reply)
			return Promise.all([])
		}
		var
		  msg= introspect( destination, "/"),
		  reply= messager(msg),
		  process= reply.then(m=> m.body[0]).then(xml2js).then(consider)
		process.catch(observer.error)
	})
}

module.exports= List
