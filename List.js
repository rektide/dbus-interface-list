var
  introspectMsg= require("./msg/introspect"),
  Messager= require("./Messager"),
  rxjs= require("rxjs"),
  xml2js= require("es6-promisify")(require("xml2js").parseString)

function List( busConnection, destination){
	var messager= Messager( busConnection)
	return rxjs.Observable.create( function( observer){
		// recurse into a node, finding all new paths, & issues ask()'s on them
		function explore( path, introspection){

		}
		// ask a node for it's introspection, & if it has more nodes under it, ask/explore those too.
		function ask( path){
			var
			  q= introspectMsg( destination, path),
			  a= messager( q),
			  processed= a.then(function( replyMessage){
				var
				  replyText= replyMessage.body[ 0],
				  replyJs= xml2js( replyText),
				  replyExplored= replyJs.then(function( introspection){
					// publish result
					observer.next([ path, introspection.node])

					// explore subnodes
					var
					  subnodes= introspection.node.node,
					  recursiveAsks= subnodes&& subnodes.map(node=> {
						var component= node.$.name
						if( !component){
							throw new Error("Expected a node name")
						}
						return ask( path+ (path=== "/"? "": "/")+ component)
					  })
					return recursiveAsks&& Promise.all(recursiveAsks)
				  })
				return replyExplored
			})
			return processed
		}
		var root= ask( "/")
		root.then(observer.complete.bind(observer), observer.error.bind(observer))
	})
}

module.exports= List
