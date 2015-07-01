

//The task is to define the RL_Agent class.
function RLAgent(){
	var self = this;
	this.epsilon = 0.1;
	this.newEpisode = true;
	this.actionValues = {};
	this.returns = {};
}

//Stub
RLAgent.prototype.decide = function(state, reward, allPossibleMoves){
	return allPossibleMoves[0];
}

//Stub
RLAgent.prototype.end = function(state, reward, cb){
	cb && cb();
}


var module = module || {};
module.exports = RLAgent;

