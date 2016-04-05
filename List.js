var
  aia= require("all-in-all"),
  introspectMsg= require("./msg/introspect"),
  Messager= require("./Messager"),
  xml2js= require("es6-promisify")(require("xml2js").parseString)

var _resolved= Promise.resolve()

function List( busConnection, destination){
	var
	  messager= Messager( busConnection),
	  res= []
	function ask( path){
		// ask a node for it's introspection, & if it has more nodes under it, ask/explore those too.
		var
		  q= introspectMsg( destination, path),
		  a= messager( q),
		  processed= a.then(function( replyMessage){
			var
			  replyText= replyMessage.body[ 0],
			  replyJs= xml2js( replyText),
			  replyExplored= replyJs.then(function( introspection){
				// explore subnodes
				var
				  subnodes= introspection.node.node,
				  recursiveAsks= subnodes&& subnodes.map(node=> ask( path+ (path=== "/"? "": "/")+ node.$.name)),
				  solution= recursiveAsks&& Promise.all( recursiveAsks)||  _resolved
				return solution.then(function(){ return [path, introspection.node]})
			  })
			return replyExplored
		  })
		res.push(processed)
		return processed
	}
	ask("/")
	return aia(res).then(filterForInterfaces)
}

function filterForInterfaces(all){
	return all.filter(i=> i[1].interface)
}

module.exports= List
