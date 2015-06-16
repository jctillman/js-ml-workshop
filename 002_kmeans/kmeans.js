
/*What is to be tested and test library*/
var KNN = require('./kmeans');
var expect = require('chai').expect;

/*Data libraries
  The first one produces random data with arbitrary dimensionality
  The other loads the MNIST digits, which have a dimensionality of 788.
*/
var randomPoints = require('../lib/rand');
var mnist = require('../lib/mnist_reader');


function KMeans(options){
	if (options == undefined){options = {};}
	this.minClusterMove = options.minClusterMove || 0.001
	this.points = [];
}

KMeans.prototype.train = function(vectors){
	this.points = this.points.concat(vectors);
}

//
KMeans.prototype._distance = function(one,two){
	return Math.sqrt(one.reduce(function(old, _, index){return old + Math.pow( one[index] - two[index], 2) }, 0));
}

KMeans.prototype._averageLocation = function(vectors){
	//console.log(vectors)
	var base = vectors[0].map(function(n){return 0;});
	vectors.forEach(function(vector){
		base = base.map(function(val, index){
			return val + vector[index];
		});
	});
	return base.map(function(n){
		return n / vectors.length;
	});
}

KMeans.prototype._averageDistance = function(vector, vectors){
	var base = vectors[0].map(function(n){return 0;});
	vectors.forEach(function(vector){
		base = base.map(function(val, index){
			return val + vector[index];
		});
	});
	return base.map(function(n){
		return n / vectors.length;
	});
}


KMeans.prototype._clusters = function(clusterNum, numOfClusters){

	var self = this;
	var ret = [];

	for(var i = 0; i < numOfClusters; i++){
		var centroids = this.points.slice(i*clusterNum,i*clusterNum+clusterNum);
		var looping = true;
		while(looping){
			//console.log("Loop")
			//console.log(centroids)
			var oldCentroids = centroids.slice();
			var belongs = centroids.map(function(){return []});

			//Clusters
			for(var x = 0, len = this.points.length; x < len; x++){
				var distances = centroids.map(function(n){ return self._distance(self.points[x], n)});
				var leastIndex = distances.reduce(function(old, cur, index, arr){ return (old.val < cur) ? old : {val: cur, index: index}; }, {val: 10000, index: 0}).index;
				belongs[leastIndex].push(this.points[x])
			}

			//Shifts
			//console.log(belongs)
			for (var x = 0; x < centroids.length; x++){
				if (belongs[x].length == 0){
					centroids[x] = self.points[Math.floor(Math.random()*self.points.length)];
				}else{
					centroids[x] = self._averageLocation(belongs[x]);
				}
			}

			//Did it shift little enough to cease everything?
			looping = !centroids.some(function(centroid, index){ return self._distance(centroid, oldCentroids[index]) <= self.minClusterMove; });
		}

		//console.log(centroids)
		ret.push( {
			centroids: centroids,
			averageDistance: centroids.reduce(function(sum, centroid, index){
				return sum + belongs[index].reduce(function(inner_sum, b, inner_index){
					return inner_sum + self._distance(centroid,b);
				}, 0) / belongs[index].length;
			}, 0) / centroids.length
		} );

	}

	return ret;
	

}


KMeans.prototype.clusters = function(clusterNum){

	var possibleClusters = this._clusters(clusterNum, 10);
	return possibleClusters.reduce(function(old, cluster, index){
		return (old.averageDistance < cluster.averageDistance) ? old : cluster;
	}, possibleClusters[0]);
	
}

KMeans.prototype.findClusters = function(maxClusterNum){

	var averageDistAndVariances = [];
	for(var x = 1; x < maxClusterNum; x++){
		averageDistAndVariances.push(this.clusters(x));
	}
	//console.log(averageDistAndVariances)

	var leaps = [];
	for(var x = 0; x < averageDistAndVariances.length - 1; x++){
		leaps.push(averageDistAndVariances[x].averageDistance - averageDistAndVariances[x+1].averageDistance);
	}

	var standardDeviation = function(arrs){
		var mean = arrs.reduce(function(a,b){return a+b;}, 0) / arrs.length;
		var standardDeviation = Math.sqrt(arrs.reduce(function(a,b){
			return a + (mean - b)*(mean - b);
		}, 0) / mean);
		return standardDeviation;
	};

	//console.log(leaps)
	var largest = 0;
	var index = 0;
	for(var y = 0; y < leaps.length; y++){
		if (standardDeviation(leaps.slice(y,y+4)) < standardDeviation(leaps)/5){
			index = y;
			break;
		}
	}

	return averageDistAndVariances[index];


}

module.exports = KMeans