
function KNN(kSize){
	this.kSize = kSize;
	this.points = [];
}

KNN.prototype.train = function(inputAndOutput){
	this.points = this.points.concat(inputAndOutput)
};

KNN.prototype._distance = function(one, two){
	return Math.sqrt(one.reduce(function(old, _, index){return old + Math.pow( one[index] - two[index], 2) }, 0));
};

KNN.prototype._distances = function(point, points){
	var self = this;
	return points.map(function(n){
		var distance = self._distance(point, n[0]);
		return [distance, n[1]];
	});
}

KNN.prototype._sorted = function(points){
	return points.sort(function(a,b){return a[0]-b[0];}).map(function(n){return n[1]});
}

KNN.prototype._majority = function(k, points){
	var self = this;
	var counted = points.reduce(function(old, n, index){
		if (index < k){
			if(old.hasOwnProperty(n)){
				old[n] = old[n] + 1;
			}else{
				old[n] = 1;
			}
		}
		return old;
	},{});
	return parseInt(Object.keys(counted).reduce(function(old, key){
		if ( counted[key] > old.number ){
			return {'key': key, number: counted[key] };
		}
		return old;
	}, {key: '', number: 0})['key']);
}

KNN.prototype.predictSingle = function(point){
	var distances = this._distances(point, this.points);
	var sorted = this._sorted(distances);
	return this._majority(this.kSize, sorted);
}

KNN.prototype.predict = function(vectors){
	var self = this;
	return vectors.map(function(n){
		return self.predictSingle(n);
	});
}

KNN.prototype.score = function(inputAndOutput){
	var self = this;
	var correct = 0;
	inputAndOutput.forEach(function(pair){
		correct = correct + ((self.predictSingle(pair[0]) == pair[1] ) ? 1 : 0);
	});
	return correct / inputAndOutput.length;
}



module.exports = KNN