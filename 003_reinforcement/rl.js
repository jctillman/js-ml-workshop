

//The task is to define the RL_Agent class.
function RLAgent(){
	var self = this;
	this.epsilon = 0.1;
	this.newEpisode = true;
	this.actionValues = {};
	this.returns = {};
}


RLAgent.prototype._discretize = function(arr, chunkSize){
	var chunkSize = chunkSize || arr.map(function(){return 1});
	return arr.map(function(n, i){
		return Math.round(n / chunkSize[i]) * chunkSize[i]; 
	});
}

RLAgent.prototype._trim = function(arr, absLimit){
	var absLimit = absLimit || arr.map(function(){return 1});
	return arr.map(function(n, i){
		return Math.min(absLimit[i], Math.max(-absLimit[i], n));
	});
}

RLAgent.prototype._max = function(arr, evaluatingFunction){
	return arr.reduce(function(oldBest, current, index){
		var evaluationOfCurrent = evaluatingFunction(current, index);
		return (oldBest.score < evaluationOfCurrent) ? {value: current, score: evaluationOfCurrent} : oldBest;
	}, {value: arr[0], score: evaluatingFunction(arr[0],0)}).value;
}

RLAgent.prototype._tokenize = function(state, moveNum){
	return this._discretize(this._trim(state.concat(moveNum),[10,15,3,3,10]),[1.5,5,1000,1,1]).toString();
}

//Returns a number, the index of the best of the "all possible moves" thing.
RLAgent.prototype._chooseBestMove = function(state, allPossibleMoves, actionValues){
	var self = this;
	return this._max(allPossibleMoves.map(function(_, n){return n;}), function(num){
		var id = self._tokenize(state, num);
		return (actionValues.hasOwnProperty(id)) ? actionValues[id] : actionValues[id] = Math.random();
	});
}

RLAgent.prototype._initializeEpisode = function(state, reward, allPossibleMoves){
		this.newEpisode = false;
		this.episodeValues = [];
		this.lastState = state;
		this.lastMove = 0;
		return allPossibleMoves[this.lastMove];
}

RLAgent.prototype._continueEpisode = function(state, reward, allPossibleMoves){
		this.episodeValues.push( {state: this._discretize(this.lastState.concat(this.lastMove)).toString(), reward: reward});
		this.lastState = state;
		this.lastMove = (this.epsilon > Math.random())
			? Math.floor(allPossibleMoves.length * Math.random())
			: this._chooseBestMove(state, allPossibleMoves, this.actionValues);
		return allPossibleMoves[this.lastMove];
}

//State is an array of continuous values.  It will need to be made discrete.
//Reward is a real number.
//All possible moves is an arbitrary array, one element of which must be returned.
RLAgent.prototype.decide = function(state, reward, allPossibleMoves){
	return (this.newEpisode) ? this._initializeEpisode(state, reward, allPossibleMoves) : this._continueEpisode(state, reward, allPossibleMoves);
}

//RL
RLAgent.prototype.end = function(state, reward, cb){
	var self = this;
	this.newEpisode = true;
	var visitedStates = [];
	this.episodeValues.forEach(function(value, i){
		if(visitedStates.indexOf(value.state) == -1){
			visitedStates.push(value.state);
			var m = self.episodeValues.slice(i, self.episodeValues.length).reduce(function(old, n){return old + n.reward},0);
			if (self.returns.hasOwnProperty(value.state)){self.returns[value.state].push(m)}else{self.returns[value.state] = [m]};
			self.actionValues[value.state] = self.returns[value.state].reduce(function(a,b){return a + b;}, 0) / self.returns[value.state].length;
		}
	});
	this.episodeValues = [];
	this.epsilon = this.epsilon * 0.9999
	cb && cb();
}

var module = module || {};
module.exports = RLAgent;

