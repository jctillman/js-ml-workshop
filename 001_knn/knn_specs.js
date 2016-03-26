
var KNN = require('./knn');
var expect = require('chai').expect;
var mnist = require('../lib/mnist_reader');
var writer = require('../lib/writer');
var randomPoints = require('../lib/rand');
/*randomPoints is a function.  You would use it like this:

  var testPoints = randomPoints(100,[1,1],[2,2]);
	
  This would return an array of length 100.

  Each element of the array would be an array / vector of length two, because 
  the second and third parameter are of length two.

  The values in each vector would be between [2,2] and [3,3]--that is,
      the n-th value in each vector is chosen by multiplying the n-th
      value in the first parameter with a random number from 0 to 1, 
      and then adding the n-th value of the third parameter.
*/




describe('Testing the basic KNN functionality.', function(){

	//KNN should be a constructor function.
	it('is a function', function(){
		expect(typeof KNN).to.equal('function');
	});

	//Objects created by the KNN should have a kSize variable, set by the constructor, and a points array.
	//The points array holds the training data.
	it('creates instances with k-size and an empty points array', function(){
		var knn = new KNN(10);
		expect(knn.kSize).to.equal(10);
		expect(knn.points).to.be.empty;
	});

	//The train function should add to the points array.
	describe('The train function works', function(){

		it('has a train function', function(){
			var knn = new KNN(10);
			expect(typeof knn.train).to.equal('function');
		});

		/*
		   Train takes an array of training data and stores it.
		   Each training element, in an array of training data, is an array of length two.
		      The first element of the subarray is a vector -- an array of numbers.
		      The second element of the subarray is a classification -- a number.

		      This is the standard way that training data is represented throughout
		      this file.

		   Example Training Data: [ [ [1,2,3],0 ] , [ [1,2,4],0 ] , [ [-1,2,3],1 ] , ... ]
		*/
		it('concatenates the points handed to the train function onto the points already within it', function(){
			var knn = new KNN(10);
			//Making fake data
			var typeA = randomPoints(100,[1,1],[0,0]).map(function(n){ return [n,1] });
			var typeB = randomPoints(100,[1,1],[1,0]).map(function(n){ return [n,0] });
			knn.train(typeA);
			expect(knn.points.length).to.equal(100);
			expect(knn.points[0][0]).to.equal(typeA[0][0])
			knn.train(typeB);
			expect(knn.points.length).to.equal(200);
			expect(knn.points[100][0]).to.equal(typeB[0][0])
		});

	});

	describe('The predict and predictSingle function works.', function(){

		/*If you want to build the predict & predictSingle functions from scratch, without
		  any guidance, you can leave this as an xdescribe rather than a describe.

		  However, if you implement these functions, it will be much easier to write predictSingle,
		  and they do provide a useful way to break down the things that predictSingle will need to do.
		*/
		xdescribe('Optional helper functions to be used in predict and predictSingle', function(){ 

			/* The purpose of the function '_distance' is to find the Euclidean norm
			   as between two vectors.

			   As input, it should take two vectors of any size.

			   As output, it should return the distance between them as determined by the
			   Euclidean norm.

			 */
			it('has function _distance, which works as expected', function(){
				var knn = new KNN(3);
				expect(typeof knn._distance).to.equal('function');
				var one_dim = knn._distance([0],[1]);
				var two_dim = knn._distance([0,0],[1,0]);
				var thr_dim = knn._distance([0,1,0],[0,2,0]);
				var for_dim = knn._distance([0,2,10,10],[0,2,11,10]);
				expect(one_dim).to.equal(1)
				expect(two_dim).to.equal(1)
				expect(thr_dim).to.equal(1)
				expect(for_dim).to.equal(1)
			});

			/* The purpose of the function '_distances' is to take a single, unclassified vector, 
			   and find the distance between that vector and a bunch of other, already-classified vectors.

			   As input, it should take a vector as the first argument.

			   It should take an array of training data as the second argument.
			   See the comment on "train" to see what this will look like. 

			   As output, it should give an array of sub-arrays which have length two.
			   	  The first element of each n-th sub-array should be
			   	  the distance between the first vector handed in, and the n-th
			   	  element of the training data.

			   	  And the second element should be the classification
			   	  of the n-th element of the input array.

			   	Example Output: [ [.1,0] , [.2,0] , [.3, 1] , [.4,0] ... ]
			   */
			it('has function _distances, which works as expected', function(){
				var knn = new KNN(10);
				expect(typeof knn._distances).to.equal('function');
				//Making fake data
				var typeA = randomPoints(100,[1,1],[0,0]).map(function(n){ return [n,1] });
				var typeB = randomPoints(100,[1,1],[1,0]).map(function(n){ return [n,0] });
				var distances = knn._distances([0,0], [[[1,0],1]].concat(typeA.concat(typeB)));
				expect(distances.length).to.equal(201);
				expect(distances[0].length).to.equal(2);
				expect(distances[0][0]).to.equal(1);
			});

			/*The basic purpose of _sorted is to take the output of _distances and sort it by distance.

			  The input should be an array of sub-arrays of length two.
			    The first element is a distance.
			    The second input is the classification corresponding to that distance.

			  The output of the second is an array of classifications,
			  ordered by the distances that (used to) accompany each classification.
			  Example Output: [1,0,1,0,2,3,2,1,1,2,2,0,0]
			*/
			it('has function _sorted, which works as expected', function(){
				var knn = new KNN(3);
				expect(typeof knn._sorted).to.equal('function');
				var sorted = knn._sorted([[100,0],[10,1],[20,1],[110,0],[120,1]]);
				expect(sorted[0]).to.equal(1)
				expect(sorted[1]).to.equal(1)
				expect(sorted[2]).to.equal(0)
				expect(sorted[3]).to.equal(0)
				expect(sorted[4]).to.equal(1)
			});

			/*The basic purpose of _majority is to tell you what classification is most common 
			  among the first k elements of an sorted list of distances and classifications.

			  It takes as input two parameters. 
			     The first is k.
			     The second is the output of _sorted--a sorted list of classifications,
			     going from closest to furthest.
			
			  It gives as output the most common classification among the
			  elements from index 0 to index k in the array passed in.
			 
			  Example Behavior:
			  --knn._majority(3,[1,2,1,2,2,2,1,1,1,1]) would return 1, because 1 is the most common element among the first three.
			  --knn._majority(5,[1,2,1,2,2,2,1,1,1,1]) would return 2, because 2 is the most common element among the first five.
			*/
			it('has function _majority, which works as expected', function(){
				var knn = new KNN(3);
				expect(typeof knn._majority).to.equal('function');
				expect(knn._majority(3,[1,2,1,2,2,2,1,1,1,1])).to.equal(1)
				expect(knn._majority(5,[1,2,1,2,2,2,1,1,1,1])).to.equal(2)
			});

		})

		/* The purpose of predictSingle is to take a single vector
		   and use the training-data in the knn function to predict
		   what classification it has. */
		it('has a predictSingle function, which takes a single vector', function(){
			var knn = new KNN(10);
			expect(typeof knn.predictSingle).to.equal('function');
			var knn = new KNN(10);
			//Making fake data
			var typeA = randomPoints(100,[1,1],[0,0]).map(function(n){ return [n,1] });
			var typeB = randomPoints(100,[1,1],[0,1]).map(function(n){ return [n,0] });
			knn.train(typeA);
			knn.train(typeB);
			expect(knn.predictSingle([0,.5])).to.equal(1)
			expect(knn.predictSingle([0,.5])).to.equal(1)
			expect(knn.predictSingle([1,1.5])).to.equal(0)
			expect(knn.predictSingle([1,1.5])).to.equal(0)
		});

		/*  This is just like predictSingle, except it applies it across 
		    an array of vectors.
		 */
		it('has a predict function, which takes an array of vectors', function(){
			var knn = new KNN(10);
			expect(typeof knn.predict).to.equal('function');
			//Making fake data
			var typeA = randomPoints(100,[1,1],[0,0]).map(function(n){ return [n,1] });
			var typeB = randomPoints(100,[1,1],[1,0]).map(function(n){ return [n,0] });
			knn.train(typeA);
			knn.train(typeB);
			var sample = randomPoints(100,[1,1],[1,0])
			var results = knn.predict(sample);
		});

		/* The purpose of score is to take in another set of data in the same format as training data.
		   Rather than add this data to the array of training data in the object, however,
		   it should run "predict" on the data and see how often the predictions of the algorithm
		   square with the actual value in the data.

		   It is important, when running such validation on an algorithm, to use different data
		   than you trained with.  I.e.--you should use one set of data to train the algorithm,
		   then an entirely different set of data to test it.  If you don't do this, you cannot
		   get an accurate view of how good your algorithm-as-trained is at generalizing and predicting.

		   Why would this be?

		 */
		it('has a score function, which takes another set of the testing data and returns a number from 1 to 0', function(){
			var knn = new KNN(10);
			expect(typeof knn.score).to.equal('function');
			//Making fake data
			var typeA = randomPoints(100,[1,1],[0,0]).map(function(n){ return [n,0] });
			var typeB = randomPoints(100,[1,1],[1,0]).map(function(n){ return [n,1] });
			knn.train(typeA);
			knn.train(typeB);
			var typeB = randomPoints(100,[1,1],[.95,0]).map(function(n){ return [n,1] });
			expect(knn.score(typeB) > 0.65).to.equal(true);
			expect(knn.score(typeB) <= 1).to.equal(true);
		});

	});
});


/*Switch this to a describe after you've completed the above.*/
xdescribe('Testing the KNN with data from the MNIST', function(){

	//Need more time, to handle all the data.
	this.timeout(10000);

	xit('Can handle somewhat chaotic data', function(){
		var knn = new KNN(1);
		var typeA = randomPoints(1000,[1,1],[0,0]).map(function(n){ return [n,0] });
		var typeB = randomPoints(1000,[1,1],[.75,0]).map(function(n){ return [n,1] });
		knn.train(typeA);
		knn.train(typeB);
		var typeB = randomPoints(100,[1,1],[0,0]).map(function(n){ return [n,0] });
		var score = knn.score(typeB);
		console.log("The program got a score of " + score + ", which means it got " + (score * 100) + "% correct.");
	});

   /* The data given to the algorithm here is the mnist data.
      This means the algorithm is trying to classify into 10 different
      classes, rather than 2, as in the above.  The input vectors are 724 elements 
      long as well, rather than 2, as in the above.  So this is a significantly
      more complex problem, with more chaotic data.

      Note that initially, while working from only 100 elements of training
      data, the algorithm is only able to get a fairly low score--although
      still far better than random chance.

      Try to improve that score.  Does fiddling with the k-number alter it 
      very much?  Or does adding more training data alter it more?

	  Running this will create .gif images, each showing how your program classified a particular image.
	  What kind of mistakes does the program make?
	  Are any of them mistakes you might make, in reading a digit?
	  How could you improve accuracy of the program?
	  
    */
	xit('Can be trained off the mnist data', function(done){
		var allElements = mnist.allElements();			//Should load up all 5000 elements
		var knn = new KNN(2);
		var trainingSet = allElements.slice(0,600); 	//Make the training set 
		var testingSet = allElements.slice(1000,1100);	//Make the testing set
		knn.train(trainingSet)
		var score = knn.score(testingSet);
		console.log("The program got a score of " + score + ", which means it got " + (score * 100) + "% correct.");

		var toClassify = testingSet.map(function(n){return n[0]});
		var toExport = knn.predict(toClassify).map(function(n, index){ return [toClassify[index],n]; } );
		writer.exportClassified(toExport, done);
	});

});