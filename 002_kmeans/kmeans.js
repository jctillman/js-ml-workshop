
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
	return arr.reduce(function(oldBest, current, index){
		var evaluationOfCurrent = evaluatingFunction(current, index);
		return (oldBest.score < evaluationOfCurrent) ? {value: current, score: evaluationOfCurrent} : oldBest;
	}, {value: arr[0], score: evaluatingFunction(arr[0], 0)}).value;
}

KMeans.prototype._clusterEvaluator = function(cluster, vectors){
	var self = this;
	return vectors.reduce(function(score, vector){
		return score + Math.pow(cluster.reduce(function(smallestDistanceSoFar, centroid){
			return Math.min(smallestDistanceSoFar, self._distance(centroid, vector));
		}, 10000000),2);
	}, 0 );
}

KMeans.prototype._averageLocation = function(vectors){
	return vectors[0].map(function(_, index){
		return vectors.reduce(function(sum, vect){
			return sum + vect[index];
		}, 0) / vectors.length;
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
			return (group.length != 0) ? self._averageLocation(group) : self._averageLocation(vectors); //vectors[Math.floor(Math.random()*vectors.length)];
		});
}

KMeans.prototype._haveShifted = function(centroids, oldCentroids){
	var self = this;
	return !centroids.every(function(centroid, index){ return self._distance(centroids[index], oldCentroids[index]) <= self.minClusterMove; });
}

KMeans.prototype._clusters = function(clusterNum, vectors){
	var self = this;
	var centroids = vectors.slice(0,clusterNum).map(function(_,index,_){
		return vectors[ Math.floor(index*vectors.length/clusterNum) + Math.floor(Math.random()*vectors.length/clusterNum) ];
	});
	var stillMoving = true;
	while(stillMoving){
		var oldCentroids = centroids.slice();
		centroids = self._shiftCentroids(centroids, vectors);
		stillMoving = self._haveShifted(centroids, oldCentroids);
	}
	return centroids;
}

KMeans.prototype._manyClusters = function(clusterAttempts, clusterNum){
	var clusterArr = [];
	for(var x = 0; x < clusterAttempts; x++){
		clusterArr.push(this._clusters(clusterNum, this.points));
	}
	return clusterArr;
};


KMeans.prototype.clusters = function(clusterNum){
	var self = this;
	return this._max( this._manyClusters( this.clusterAttempts, clusterNum ) , function(cluster){
		return -self._clusterEvaluator(cluster, self.points);
	});
}


//Extra credit work.

KMeans.prototype._standardDeviation = function(arrs){
	var mean = arrs.reduce(function(a,b){return a+b;}, 0) / arrs.length;
	return Math.sqrt(arrs.reduce(function(a,b){
		return a + (mean - b)*(mean - b);
	}, 0) / mean);
};

KMeans.prototype.findClusters = function(maxClusterNum){
	var allClusters = [];
	for(var x = 1; x < maxClusterNum; x++){
		allClusters.push(this.clusters(x));
	}

	var leaps = [];
	for(var x = 0; x < allClusters.length - 1; x++){
		leaps.push(this._clusterEvaluator(allClusters[x], this.points) - this._clusterEvaluator(allClusters[x+1], this.points));
	}
	var largest = 0;
	var index = 0;
	for(var y = 0; y < leaps.length; y++){
		if (this._standardDeviation(leaps.slice(y,leaps.length)) < this._standardDeviation(leaps)/3.5){
			index = y;
			break;
		}
	}
	return allClusters[index];
}

module.exports = KMeans