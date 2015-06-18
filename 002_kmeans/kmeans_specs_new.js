
var KMeans = require('./kmeans_new');
var expect = require('chai').expect;
var randomPoints = require('../lib/rand');
var mnist = require('../lib/mnist_reader');

/*This is useful for tests, to see if values are converging on 
  the correct location for the centroid.

  Yes, you can use it for the _distance function below.
*/
var distance = function(one,two){
	return Math.sqrt(one.reduce(function(old, _, index){return old + Math.pow( one[index] - two[index], 2) }, 0));
}


describe('Testing required k-means functionality.', function(){

	it('is a function', function(){
		expect(typeof KMeans).to.equal('function');
	});

	it('should have all the requisite function', function(){
		var km = new KMeans();
		expect(km.points).to.be.empty;							//Points / vectors with which the algorithm is to be trained.
		expect(km.minClusterMove !== undefined).to.be.true;		//When all the clusters move less than this, k-means stops adjusting
		expect(typeof km.train).to.equal('function');			//Adds vectors to points
		expect(typeof km.clusters).to.equal('function');		//Returns a list of centroids
	});

	/* As in the prior exercise, the following are functions which might make
	   the task of writing _clusters much easier.  But it is
	   not necessary that you use them in any way.
	 */
	describe('Optional helper functions to help build the k-means dataset', function(){

		/* The function _distance takes as input two vectors of any length, and returns the Euclidean norm of the difference between them
		   That is, it takes two vectors and returns the Euclidean distance between the positions that they 
		   indicate in n-dimensional space.
		*/
		it('has _distance, which determines the Euclidean norm / distance between two vectors', function(){
			var km = new KMeans();
			expect(typeof km._distance).to.equal('function');
			expect(km._distance([0,0],[3,4])).to.equal(5);
			expect(km._distance([20,0],[21,0])).to.equal(1);
			expect(km._distance([20,20],[20,20])).to.equal(0);
		});
		/* The function _max takes as input an array and a function.  The function should return a number when any element
		   of the array is fed into it.  _max itself will return the value from the array which is greatest when 
		   fed into the function passed to max.

		   Example: knn._max(['a','bb','c','aaa','cc'], function(n){return n.length; }) will return 'aaa'

		   This is actually the same as the lodash max, so if you want to you can just use that.
		 */
		it('has _max, which takes an array and a function and returns the element from the array for which what the function returns is highest', function(){
			var km = new KMeans();
			expect(typeof km._max).to.equal('function');
			expect(km._max([0,1,2,3,4,5,6], function(n){return n;})).to.equal(6);
			expect(km._max([0,1,2,3,4,5,6], function(n){return -n;})).to.equal(0);
			expect(km._max(['a','sas','asdasd','ssd'], function(n){return n.length;})).to.equal('asdasd');
		});

		/* The function _clusterEvaluator takes as input two things--an array of centroids (vectors) and an array of training points (vectors).
		   It then evaluates how good the clustering is, by return the average distance from each element in the training points
		   to the closest of the centroids.  A list of centroids which has a smaller average length to each training point is better
		   than a list of centroids which has a larger average length to the same list of training points.
		*/
		it('has _clusterEvaluator, which scores clusters according to the average distances from points to centroids in each', function(){
			var km = new KMeans();
			expect(typeof km._clusterEvaluator).to.equal('function');
			expect(km._clusterEvaluator( [[0,0],[100,100]],[[1,0],[0,1],[101,100],[100,101]] ) ).to.equal(1);
			expect(km._clusterEvaluator( [[0,0],[100,100]],[[2,0],[0,2],[102,100],[100,102]] ) ).to.equal(2);
			expect(km._clusterEvaluator( [[0,0]],[[3,0],[0,3],[0,-3],[-3,0]] ) ).to.equal(3);
		});

		/* The function _averageLocation takes an array of vectors and returns the mean location.

		   This could obviously be useful when determining the center of a group of vectors.
		 */
		it('has _averageLocation, which takes an array of vectors and returns the mean location', function(){
			var km = new KMeans();
			expect(typeof km._averageLocation).to.equal('function');
			expect(km._averageLocation([[1,1],[1,1],[4,4]])).to.eql([2,2])
			expect(km._averageLocation([[1,1],[1,1],[2,2],[2,2]])).to.eql([1.5,1.5])
			expect(km._averageLocation([[1,1],[2,2],[3,3]])).to.eql([2,2])
			expect(km._averageLocation([[1,1],[1,1]])).to.eql([1,1])
			expect(km._averageLocation([[1,2],[1,2],[2,3],[3,4],[3,4]])).to.eql([2,3])
			expect(km._averageLocation([[1,10],[1,10],[2,10],[3,10],[3,10]])).to.eql([2,10])
		});

		/* The following function, _shiftCentroids, is rather the heart of k-means.  

		   It takes as input an array of centroids, and an array of all the training data.

		   It outputs a new list of shifted shifted centroids.  This list is produced by dividing the training data into groups,
		   each group consisting of the points closer to one centroid than to any other centroid, and then shifting that centroid
		   to the mean location of the groups.

		   This can be accomplished with a map function, with a map func

		  */

		it('has _shiftCentroids, which takes centroids, and all the points and shifts centroids a step', function(){
			var km = new KMeans();
			expect(typeof km._shiftCentroids).to.equal('function');
		});

		it('has _manyClusters, which is returns an array of clusters', function(){
			var km = new KMeans();
			expect(typeof km._manyClusters).to.equal('function');
		});



	});


	describe('The algorithm can find locations successfully', function(){

		it(' adds points to the list of points that it trains with, when train is called', function(){
			var knn = new KMeans();
			var typeA = randomPoints(100,[1,1],[0,0]);
			knn.train(typeA);
			expect(knn.points.length).to.equal(100);
		});

		it(' can determine the location of two centroids, being told there are two', function(){
			var knn = new KMeans();
			var typeA = randomPoints(100,[1,1],[0,0]);
			var typeB = randomPoints(100,[1,1],[50,0]);
			var both = typeB.concat(typeA);
			knn.train(both);
			var res = knn.clusters(2);
			expect(res.length).to.equal(2);
			expect( (distance(res[0], [0.5,0.5]) < .1) || (distance(res[0], [50.5,0.5]) < .1) ).to.be.true;
			expect( (distance(res[1], [0.5,0.5]) < .1) || (distance(res[1], [50.5,0.5]) < .1) ).to.be.true;
		});

		it(' can determine the location of three centroids, being told there are three', function(){
			var knn = new KMeans();
			var typeA = randomPoints(100,[1,1],[0,0]);
			var typeB = randomPoints(100,[1,1],[30,0]);
			var typeC = randomPoints(100,[1,1],[15,20]);
			var all = typeA.concat(typeB.concat(typeC));
			knn.train(all);
			var res = knn.clusters(3);
			expect(res.length).to.equal(3);
			expect( (distance(res[0], [0.5,0.5]) < .1) || (distance(res[0], [30.5,0.5]) < .1) || (distance(res[0], [15.5,20.5]) < .1)).to.be.true;
			expect( (distance(res[1], [0.5,0.5]) < .1) || (distance(res[1], [30.5,0.5]) < .1) || (distance(res[1], [15.5,20.5]) < .1)).to.be.true;
			expect( (distance(res[2], [0.5,0.5]) < .1) || (distance(res[2], [30.5,0.5]) < .1) || (distance(res[2], [15.5,20.5]) < .1)).to.be.true;
		});

		it(' can determine the location of three close centroids, being told there are three', function(){
			var knn = new KMeans();
			var typeA = randomPoints(100,[1,1],[0,0]);
			var typeB = randomPoints(100,[1,1],[3,0]);
			var typeC = randomPoints(100,[1,1],[1.5,2]);
			var all = typeA.concat(typeB.concat(typeC));
			knn.train(all);
			var res = knn.clusters(3);
			expect(res.length).to.equal(3);
			expect( (distance(res[0], [0.5,0.5]) < .1) || (distance(res[0], [3.5,0.5]) < .1) || (distance(res[0], [2,2.5]) < .1)).to.be.true;
			expect( (distance(res[1], [0.5,0.5]) < .1) || (distance(res[1], [3.5,0.5]) < .1) || (distance(res[1], [2,2.5]) < .1)).to.be.true;
			expect( (distance(res[2], [0.5,0.5]) < .1) || (distance(res[2], [3.5,0.5]) < .1) || (distance(res[2], [2,2.5]) < .1)).to.be.true;
		});
	});

	xdescribe('The algorithm finds centroids for the MNIST data successfully', function(){


	});

});

xdescribe('Testing optional k-means functionality', function(){

	describe('The algorithm can determine the number of clusters, not being told how many there are.', function(){

		it('can determine the number of clusters when there are two, very separate', function(){
			var knn = new KMeans();
			var typeA = randomPoints(100,[1,1],[0,0]);
			var typeB = randomPoints(100,[1,1],[50,0]);
			var both = typeA.concat(typeB)
			knn.train(both);
			var res = knn.findClusters(10);
			expect(res.centroids.length).to.equal(2);
		});

		it('can determine the number of clusters when there are three, pretty separate', function(){
			var knn = new KMeans();
			var typeA = randomPoints(100,[1,1],[0,0]);
			var typeB = randomPoints(100,[1,1],[5,0]);
			var typeC = randomPoints(100,[1,1],[3,4]);
			var all = typeA.concat(typeB.concat(typeC));
			knn.train(all)
			var res = knn.findClusters(10);
			expect(res.centroids.length).to.equal(3);
		});

		it('can determine the number of clusters when there are four, fairly close', function(){
			var knn = new KMeans();
			var typeA = randomPoints(100,[1,1],[0,0]);
			var typeB = randomPoints(100,[1,1],[2,0]);
			var typeC = randomPoints(100,[1,1],[1,1]);
			var typeD = randomPoints(100,[1,1],[1,-1]);
			var all = typeA.concat(typeB.concat(typeC.concat(typeD)));
			knn.train(all)
			var res = knn.findClusters(10);
			expect(res.centroids.length).to.equal(4);
		});

		it('can determine the number of clusters when there are five, pretty close ones', function(){
			var knn = new KMeans();
			var typeA = randomPoints(100,[1,1],[0,0]);
			var typeB = randomPoints(100,[1,1],[2,0]);
			var typeC = randomPoints(100,[1,1],[0,2]);
			var typeD = randomPoints(100,[1,1],[-2,0]);
			var typeE = randomPoints(100,[1,1],[0,-2]);
			var all = typeA.concat(typeB.concat(typeC.concat(typeD.concat(typeE))));
			knn.train(all)
			var res = knn.findClusters(10);
			expect(res.centroids.length).to.equal(5);
		});

		it('can determine the number of clusters when there are four, very close ones', function(){
			var knn = new KMeans();
			var typeB = randomPoints(100,[1,1],[1,0]);
			//console.log(typeB[0])
			var typeC = randomPoints(100,[1,1],[0,1]);
			var typeD = randomPoints(100,[1,1],[-1,0]);
			var typeE = randomPoints(100,[1,1],[0,-1]);
			var all = typeB.concat(typeC.concat(typeD.concat(typeE)));
			knn.train(all)
			var res = knn.findClusters(10);
			expect(res.centroids.length).to.equal(4);
		});

	});

});



 // var knn = new KMeans();
 // var someElements = mnist.unknown().map(function(n){return n[0]});
 // //console.log(someElements[0])
 // knn.train(someElements.slice(0,1000))
 // //console.log("asdad", knn.points.length)
 // var res = knn.findClusters(10);
 // //console.dir(res);
 // console.log("It found " + res.centroids.length + " characters.");


