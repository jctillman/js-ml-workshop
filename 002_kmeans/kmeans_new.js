
/*What is to be tested and test library*/
var expect = require('chai').expect;


function KMeans(options){
	if (options == undefined){options = {};}
	this.minClusterMove = options.minClusterMove || 0.0001;
	this.clusterAttempts = 10;
	this.points = [];
}

KMeans.prototype.train = function(vectors){
	this.points = this.points.concat(vectors);
}

KMeans.prototype._distance = function(one,two){
	return Math.sqrt(one.reduce(function(old, _, index){return old + Math.pow( one[index] - two[index], 2) }, 0));
}

KMeans.prototype._max = function(arr, evaluatingFunction){
	return arr.reduce(function(oldBest, current){
		var evaluationOfCurrent = evaluatingFunction(current);
		return (oldBest.score < evaluationOfCurrent) ? {value: current, score: evaluationOfCurrent} : oldBest;
	}, {value: arr[0], score: evaluatingFunction(arr[0])}).value;
}

KMeans.prototype._clusterEvaluator = function(cluster, vectors){
	var self = this;
	return vectors.reduce(function(score, vector){
		return score + cluster.reduce(function(smallestDistanceSoFar, centroid){
			return Math.min(smallestDistanceSoFar, self._distance(centroid, vector));
		}, 10000000)
	}, 0 ) / vectors.length;
}

KMeans.prototype._averageLocation = function(vectors){
	return vectors[0].map(function(_, index){
		return vectors.reduce(function(sum, val){
			return sum + val[index];
		}, 0) / vectors.length;
	});
}



KMeans.prototype.clusters = function(clusterNum){
	var self = this;
	return this._max( this._manyClusters( this.clusterAttempts, clusterNum ) , function(cluster){
		return self._clusterEvaluator(cluster, self.points);
	});
}


KMeans.prototype._shiftCentroids = function(centroids, vectors){
	var self = this;
	return vectors.reduce(function(belongs, vector, index){
		var index = centroids.reduce(function(old, centroid, inner_index){
					var distance = self._distance(centroid, vector)
					return (old.distance < distance) ? old : {index: inner_index, distance: distance}; 
				}, {index: 0, distance: self._distance(centroids[0], vector) }).index;
			belongs[index].push(vector);
			return belongs;
			}, centroids.map(function(){return []}))
		.map(function(group){
			return (group.length != 0) ? self._averageLocation(group) : vectors[Math.floor(Math.random()*vectors.length)];
		});
}

// KMeans.prototype._assignToCentroids = function(centroids, vectors){
// 	var self = this;
// 	var belongs = centroids.map(function(){return []});
// 	for(var x = 0, len = vectors.length; x < len; x++){
// 		var distances = centroids.map(function(n){ return self._distance(vectors[x], n)});
// 		var leastIndex = distances.reduce(function(old, cur, index, arr){ return (old.val < cur) ? old : {val: cur, index: index}; }, {val: 10000, index: 0}).index;
// 		belongs[leastIndex].push(vectors[x])
// 	}
// 	return belongs;
// }

// KMeans.prototype._centroidsOfPoints = function(belongs){
// 	var self = this;
// 	//console.log(belongs)
// 	return belongs.map(function(_, x){
// 		return (belongs[x].length != 0) ? self._averageLocation(belongs[x]) : self.points[Math.floor(Math.random()*self.points.length)];
// 	});
// }



KMeans.prototype._haveShifted = function(centroids, oldCentroids){
	var self = this;
	return !centroids.some(function(centroid, index){ return self._distance(centroid, oldCentroids[index]) <= self.minClusterMove; });
}


KMeans.prototype._clusters = function(clusterNum){
	var self = this;
	var centroids = this.points.slice(0,clusterNum).map(function(_,index,_){
		return self.points[ Math.floor(index*self.points.length/clusterNum) + Math.floor(Math.random()*self.points.length/clusterNum) ];
	});
	var stillMoving = true;
	while(stillMoving){
		var oldCentroids = centroids.slice();
		centroids = self._shiftCentroids(centroids, this.points);
		stillMoving = self._haveShifted(centroids, oldCentroids);
	}
	return centroids;
}

KMeans.prototype._manyClusters = function(clusterAttempts, clusterNum){
	var clusterArr = [];
	for(var x = 0; x < clusterAttempts; x++){
		clusterArr.push(this._clusters(clusterNum))
	}
	return clusterArr;
};


/*



KMeans.prototype._averageLocation = function(vectors){
	return vectors[0].map(function(_, index){
		return vectors.reduce(function(sum, val){
			return sum + val[index];
		}, 0) / vectors.length;
	});
}

KMeans.prototype._haveShifted = function(centroids, oldCentroids){
	var self = this;
	return !centroids.some(function(centroid, index){ return self._distance(centroid, oldCentroids[index]) <= self.minClusterMove; });
}

KMeans.prototype._averageDistance = function(centroids, belongs){
	var self = this;
	var totalNum = centroids.reduce(function(old,_,index){return old+belongs[index].length},0);
	return centroids.reduce(function(sum, centroid, index){
		return sum + belongs[index].reduce(function(inner_sum, b, inner_index){
			return inner_sum + self._distance(centroid,b);
		}, 0);
	}, 0) / totalNum;
}

KMeans.prototype._assignToCentroids = function(centroids, vectors){
	var self = this;
	var belongs = centroids.map(function(){return []});
	for(var x = 0, len = vectors.length; x < len; x++){
		var distances = centroids.map(function(n){ return self._distance(vectors[x], n)});
		var leastIndex = distances.reduce(function(old, cur, index, arr){ return (old.val < cur) ? old : {val: cur, index: index}; }, {val: 10000, index: 0}).index;
		belongs[leastIndex].push(vectors[x])
	}
	return belongs;
}

KMeans.prototype._centroidsOfPoints = function(belongs){
	var self = this;
	return belongs.map(function(_, x){
		return (belongs[x].length != 0) ? self._averageLocation(belongs[x]) : self.points[Math.floor(Math.random()*self.points.length)];
	});
}

KMeans.prototype.clusters = function(clusterNum){
	var possibleClusters = this._clusters(clusterNum, this.clusterAttempts);
	return possibleClusters.reduce(function(old, cluster, index){
		return (old.averageDistance < cluster.averageDistance) ? old : cluster;
	}, possibleClusters[0]);
}

KMeans.prototype._clusters = function(clusterNum, numOfClusters){
	var self = this;
	var ret = [];
	for(var i = 0; i < numOfClusters; i++){
		var centroids = this.points.slice(i*clusterNum,i*clusterNum+clusterNum);
		var looping = true;
		while(looping){
			var oldCentroids = centroids.slice();
			var belongs = self._assignToCentroids(centroids, this.points);
			centroids = self._centroidsOfPoints(belongs);			
			looping = self._haveShifted(centroids, oldCentroids);
		}
		ret.push( {
			centroids: centroids,
			averageDistance: this._averageDistance(centroids, belongs)
		});
	}
	return ret;
}







KMeans.prototype._standardDeviation = function(arrs){
	var mean = arrs.reduce(function(a,b){return a+b;}, 0) / arrs.length;
	return Math.sqrt(arrs.reduce(function(a,b){
		return a + (mean - b)*(mean - b);
	}, 0) / mean);
};

KMeans.prototype.findClusters = function(maxClusterNum){
	var averageDistAndVariances = [];
	for(var x = 1; x < maxClusterNum; x++){
		averageDistAndVariances.push(this.clusters(x));
	}
	var leaps = [];
	for(var x = 0; x < averageDistAndVariances.length - 1; x++){
		leaps.push(averageDistAndVariances[x].averageDistance - averageDistAndVariances[x+1].averageDistance);
	}
	console.log(leaps)
	var largest = 0;
	var index = 0;
	for(var y = 0; y < leaps.length; y++){
		if (this._standardDeviation(leaps.slice(y,leaps.length)) < this._standardDeviation(leaps)/4){
			index = y;
			break;
		}
	}
	return averageDistAndVariances[index];
}
*/
module.exports = KMeans