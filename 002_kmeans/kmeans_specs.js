
/*What is to be tested and test library*/
var KMeans = require('./kmeans');
var expect = require('chai').expect;

/*Data libraries
  The first one produces random data with arbitrary dimensionality
  The other loads the MNIST digits, which have a dimensionality of 788.
*/
var randomPoints = require('../lib/rand');
var mnist = require('../lib/mnist_reader');

/*And this is useful for determining the distance
  between vectors to see if approximately correct centroids
  have been found.*/
var distance = function(one,two){
	return Math.sqrt(one.reduce(function(old, _, index){return old + Math.pow( one[index] - two[index], 2) }, 0));
}

/*This describe block basically deals with the basics of 
  k-means and makes sure it works in broad strokes.*/
describe('Testing the basic k-means functionality.', function(){

	//KNN should be a constructor function.
	it('is a function', function(){
		expect(typeof KMeans).to.equal('function');
	});

	it('should have all the requisite function', function(){
		var km = new KMeans();
		expect(typeof km.train).to.equal('function');
		expect(typeof km.clusters).to.equal('function');
		expect(typeof km.findClusters).to.equal('function');
	});

	describe('Can perform more interesting tasks.', function(){

		xdescribe('Optional helper functions to help build the k-means dataset', function(){

			it('has _average, which takes a list of vectors and returns the average of them all', function(){

			});

			it('has _divide, which on being given a list of vectors, returns an array of vectors', function(){

			});

		});


		describe('The algorithm can find locations successfully', function(){

			it(' can determine the location of two centroids, being told there are two', function(){
				var knn = new KMeans();
				var typeA = randomPoints(100,[1,1],[0,0]);
				var typeB = randomPoints(100,[1,1],[50,0]);
				var both = typeB.concat(typeA);
				knn.train(both);
				var res = knn.clusters(2);
				expect(res.centroids.length).to.equal(2);
				expect( (distance(res.centroids[0], [0.5,0.5]) < .1) || (distance(res.centroids[0], [50.5,0.5]) < .1) ).to.be.true;
				expect( (distance(res.centroids[1], [0.5,0.5]) < .1) || (distance(res.centroids[1], [50.5,0.5]) < .1) ).to.be.true;
			});

			it(' can determine the location of three centroids, being told there are three', function(){
				var knn = new KMeans();
				var typeA = randomPoints(100,[1,1],[0,0]);
				var typeB = randomPoints(100,[1,1],[30,0]);
				var typeC = randomPoints(100,[1,1],[15,20]);
				var all = typeA.concat(typeB.concat(typeC));
				knn.train(all);
				var res = knn.clusters(3);
				expect(res.centroids.length).to.equal(3);
				expect( (distance(res.centroids[0], [0.5,0.5]) < .1) || (distance(res.centroids[0], [30.5,0.5]) < .1) || (distance(res.centroids[0], [15.5,20.5]) < .1)).to.be.true;
				expect( (distance(res.centroids[1], [0.5,0.5]) < .1) || (distance(res.centroids[1], [30.5,0.5]) < .1) || (distance(res.centroids[1], [15.5,20.5]) < .1)).to.be.true;
				expect( (distance(res.centroids[2], [0.5,0.5]) < .1) || (distance(res.centroids[2], [30.5,0.5]) < .1) || (distance(res.centroids[2], [15.5,20.5]) < .1)).to.be.true;
			
			});
		});

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
				var typeC = randomPoints(100,[1,1],[0,1]);
				var typeD = randomPoints(100,[1,1],[-1,0]);
				var typeE = randomPoints(100,[1,1],[0,-1]);
				var all = typeB.concat(typeC.concat(typeD.concat(typeE)));
				knn.train(all)
				var res = knn.findClusters(10);
				expect(res.centroids.length).to.equal(4);
			});

		});

		describe('The algorithm can determine the number of clusters, not being told how many there are.', function(){

		});
	
	});

});	