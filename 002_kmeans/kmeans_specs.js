
var KMeans = require('./kmeans_new');
var expect = require('chai').expect;
var randomPoints = require('../lib/rand');
var mnist = require('../lib/mnist_reader');

/*This is useful for tests, to see if values are converging on 
  the correct location for the centroid.*/
var distance = function(one,two){
	return Math.sqrt(one.reduce(function(old, _, index){return old + Math.pow( one[index] - two[index], 2) }, 0));
}


describe('Testing required k-means functionality.', function(){

	//KNN should be a constructor function.
	it('is a function', function(){
		expect(typeof KMeans).to.equal('function');
	});

	it('should have all the requisite function', function(){
		var km = new KMeans();
		expect(km.points).to.be.empty;							//Points / vectors with which the algorithm is to be trained.
		expect(km.minClusterMove !== undefined).to.be.true;		//When all the clusters move less than this, k-means stops adjusting
		expect(typeof km.train).to.equal('function');			//Adds points for 
		expect(typeof km.clusters).to.equal('function');
	});

	describe('Optional helper functions to help build the k-means dataset', function(){

		it('has _distance, which determines the Euclidean norm / distance between two vectors', function(){
			var km = new KMeans();
			expect(typeof km._distance).to.equal('function');
			expect(km._distance([0,0],[3,4])).to.equal(5);
			expect(km._distance([20,0],[21,0])).to.equal(1);
			expect(km._distance([20,20],[20,20])).to.equal(0);
		})

		it('has _averageLocation, which takes a list of vectors and returns the median of all of them', function(){
			var km = new KMeans();
			expect(typeof km._averageLocation).to.equal('function');
			expect(km._averageLocation([[0,0],[3,3]])).to.eql([1.5,1.5]);
			expect(km._averageLocation([[0,0],[0,1],[0,2],[0,3],[0,4]])).to.eql([0,2]);
			expect(km._averageLocation([[10,0],[0,1],[5,2],[10,3],[0,4]])).to.eql([5,2]);
			expect(km._averageLocation([[10,0,10],[0,4,10]])).to.eql([5,2,10]);
		});

		it('has _assignToCentroids, which takes an array of centroids, and an array of vectors, and returns an ordered list of vectors belonging to each', function(){
			var km = new KMeans();
			expect(typeof km._assignToCentroids).to.equal('function');
			expect(km._assignToCentroids([[0,0],[100,100]],[[1,0],[100,101]])).to.eql([[[1,0]],[[100,101]]]);
			expect(km._assignToCentroids([[0,0]],[[1,0],[100,101]])).to.eql([[[1,0],[100,101]]]);
			expect(km._assignToCentroids([[0,0],[100,100]],[[1,0]])).to.eql([[[1,0]],[[100,101]]]);
		});

		it('has _centroidsOfPoints, which takes a list of centroids, and a list of points that belong to them, and returns the new centroids', function(){
			var km = new KMeans();
			expect(typeof km._centroidsOfPoints).to.equal('function');
			expect(km._centroidsOfPoints())
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

	xdescribe('The algorithm finds centroids for the MNIST data successfully', function(){


	});

});

describe('Testing optional k-means functionality', function(){

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


