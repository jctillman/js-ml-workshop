var rl = require('./rl');
var expect = require('chai').expect;



describe('Basic helper functions', function(){

	//Same as elsewhere.
	it('max function works', function(){
		var max = rl.prototype._max;
		expect(typeof max).to.equal('function');
		//Usual stuff
		expect(max([0,1,2,3,4,5,6], function(n, index){return n;})).to.equal(6);
		expect(max([0,1,2,3,4,5,6], function(n, index){return -n;})).to.equal(0);
		expect(max(['a','sas','asdasd','ssd'], function(n){return n.length;})).to.equal('asdasd');
		//With index
		expect(max([0,1,2,3,4,5,6], function(n, index){return -index;})).to.equal(0);
		expect(max([10,1,2,3,4,5,6], function(n, index){return -index;})).to.equal(10);
		expect(max([7,1,2,6,4,3,2], function(n, index){return index+n;})).to.equal(6);
	});

	it('discretize function works', function(){
		var d = rl.prototype._discretize;
		expect(typeof d).to.equal('function');
		expect(d([1.1,1.2,1.8,2])).to.eql([1,1,2,2])
		expect(d([1.01,1.2,1.8,2.9])).to.eql([1,1,2,3])
		expect(d([1.01,1.2,1.8,2.9],[10,10,10,10])).to.eql([0,0,0,0]);
		expect(d([0.99,0.98,1.8,3.9],[2,2,2,2])).to.eql([0,0,2,4]);
	});

	it('chooseBestMove function works', function(){
		var instance = new rl();
		var actionValues = {'0,0': 1, '0,1': 2, '1,0': 2, '1,1': 1}
		var state = [0];
		var allPossibleMoves = [0,1];
		expect(instance._chooseBestMove(state, allPossibleMoves, actionValues)).to.eql(1);
		state = [1]
		expect(instance._chooseBestMove(state, allPossibleMoves, actionValues)).to.eql(0);
		state = [2]
		expect(actionValues.hasOwnProperty('2,0')).to.eql(false);
		expect(actionValues.hasOwnProperty('2,1')).to.eql(false);
		instance._chooseBestMove(state, allPossibleMoves, actionValues);
		expect(actionValues.hasOwnProperty('2,0')).to.eql(true);
		expect(actionValues.hasOwnProperty('2,1')).to.eql(true);
	});



});