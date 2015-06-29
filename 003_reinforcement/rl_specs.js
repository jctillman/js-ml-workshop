var rl = require('./rl');
var expect = require('chai').expect;

describe('All tests for the reinforcement learning agent', function(){

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

		/* _discretize is necessary because, as mentioned in the workshop, the ML
		   agent cannot learn unless there are a finite number of states, so
		   it can return to them again and again.  Discretize takes an array 
		   of continuous numbers, representing a state, and returns an array
		   which has had those numbers smashed some of a set of close 
		   integers.

		   It takes as input one or two arrays.

		   In the case that it takes one array, it returns that array with
		   each element rounded to the nearest integer.

		   In the case that it takes two arrays, it should return an array
		   with the n-th element of the first adjusted to the nearest multiple
		   of the n-th element of the second.
		   */
		it('_discretize function works', function(){
			var d = rl.prototype._discretize;
			expect(typeof d).to.equal('function');
			expect(d([1.1,1.2,1.8,2])).to.eql([1,1,2,2])
			expect(d([1.01,1.2,1.8,2.9])).to.eql([1,1,2,3])
			expect(d([1.01,1.2,1.8,2.9],[10,10,10,10])).to.eql([0,0,0,0]);
			expect(d([0.99,0.98,1.8,3.9],[2,2,2,2])).to.eql([0,0,2,4]);
		});

		/* _trim is also necessary becase the ML agent cannot learn unless
		   there are a finite number of states.  While _discretize rounds numbers
		   in an array to particular integers, _trim removes the extreme values from
		   the numbers in an array.  After applying both _trim and _discretize to an array,
		   one can only get back a finite set of array values.

		   Trim takes two arrays.  It returns an array, each element of which consists
		   of the n-th value of the first array clamped between the absolute value 
		   and the negative absolute value of the n-th element of the second.
		*/
		it('_trim function works', function(){
			var d = rl.prototype._trim;
			expect(typeof d).to.equal('function');
			expect(d([1,2,3,4],[1,1,1,1])).to.eql([1,1,1,1]);
			expect(d([0,1,2,-1,2],[1,1,1,1,1])).to.eql([0,1,1,-1,1],1);
			expect(d([-3,-2,-1,0,1,2,3],[2,2,2,2,2,2,2])).to.eql([-2,-2,-1,0,1,2,2]);
		});

		/* As mentioned in the workshop, a big part of reinforcement learning is figuring
		   out how to estimate the action-value function for a policy.  The easiest way to store
		   action-value estimates in javascript is in an object, with a token for each state-action
		   pair as the key for the items in the object.
	

			_tokenize is a function that takes a state and a move, and returns a single token
		   used to identify this pair in the object defining the action-value function.

		   It should use _trim, _discretize, and toString to do this.

		   There aren't any real tests for this, because a lot of the tweaking of the algorithm
		   can go into how coarse of a discretization you want to use.  Keeping in mind that the
		   state function looks like [location, angle, locationSpeed, angularSpeed], I've had a 
		   lot of success using small rounding values (1) for the first two while using enormous 
		   rounding values (1000) for the second.  This effectively reduces the dimensionality of the
		   state-space from 4d to 2d; while this is a loss of information, it means that it is much
		   easier to search through the entirety of the state space.
		 */
		 it('_tokenize function works', function(){
		 	var inst = new rl();
		 	expect(typeof inst._tokenize).to.equal('function');
		 })


		/* 
		   The basic idea of _chooseBestMove is that you pass it a (1) state (an array of real numbers),
		   an (2) array of all possible moves, and (3) a object which has of estimated action-values
		   for particular states.  It will return the index of the best move in (2).

		   In particular, the state will be an array with
		   [location (position from -5,5), angle (-40 to 40), linearSpeed (smaller), and angularSpeed (smaller)]
		   The content of allPossible moves doesn't actually matter.
		   Action values is an object where each key is a tokenization of a state + a move from that state,
		   and the value for each key is the average return after making that move in that state.

		   It will need to round (state) to a discrete value before using it to access the previous
		   action-value in actionValues.
		*/
		it('_chooseBestMove function works', function(){

			//Is a function
			var instance = new rl();
			expect(typeof instance._chooseBestMove).to.equal('function');
		});

		it('_initalizeEpisode exists', function(){
			var instance = new rl();
			expect(typeof instance._chooseBestMove).to.equal('function');
		})

		it('_continueEpisode exists', function(){
			var instance = new rl();
			expect(typeof instance._chooseBestMove).to.equal('function');
		})

	});

})