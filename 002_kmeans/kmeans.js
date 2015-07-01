
//Again, I'll start this off with the very beginning of the constructor function.
function KMeans(options){
	if (options == undefined){options = {};}
	this.minClusterMove = options.minClusterMove || 0.0001;
	this.clusterAttempts = 10;
	this.points = [];
}


module.exports = KMeans