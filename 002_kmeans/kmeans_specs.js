
var KMeans = require('./kmeans');
var expect = require('chai').expect;
var randomPoints = require('../lib/rand');
var mnist = require('../lib/mnist_reader');
var writer = require('../lib/writer');

/*The function 'distance' is useful for tests, to see if values are converging on 
  the correct location for the centroid.

  Yes, you can use it for the '_distance' function below if you wish.
*/
var distance = function(one,two){
	return Math.sqrt(one.reduce(function(old, _, index){return old + Math.pow( one[index] - two[index], 2) }, 0));
}


describe('Testing required k-means functionality.', function(){

	it('is a function', function(){
		expect(typeof KMeans).to.equal('function');
	});

	it('should have all the requisite functions', function(){
		var km = new KMeans();
		//The array 'points' is the set of vectors with which the algorithm is to be trained.
		expect(km.points).to.be.empty;
		//When all the clusters move less than this per training period, k-means stops adjusting							
		expect(km.minClusterMove !== undefined).to.be.true;
		expect(typeof km.train).to.equal('function');			//Adds vectors to points
		expect(typeof km.clusters).to.equal('function');		//Returns a list of centroids
	});

	it(' adds points to the list of points that it trains with, when train is called', function(){
			var knn = new KMeans();
			var typeA = randomPoints(100,[1,1],[0,0]);
			knn.train(typeA);
			expect(knn.points.length).to.equal(100);
	});

	/* As in the prior exercise, the following are functions which might make
	   the task of writing the function 'clusters' much easier.  But it is
	   not necessary that you use them in any way.  I suggest that you 
	   look through them in any event, though, to get an idea of the kinds of
	   functions you will need to write.
	 */
	xdescribe('Optional helper functions to help build the k-means algorithm', function(){

		/* The function '_distance' takes as input two vectors of any length,
		   and returns the Euclidean norm of the difference between them
		   That is, it takes two vectors of length n and returns the Euclidean distance
		   between the positions that they indicate in n-dimensional space.
		*/
		it('has _distance, which determines the Euclidean norm / distance between two vectors', function(){
			var km = new KMeans();
			expect(typeof km._distance).to.equal('function');
			expect(km._distance([0,0],[3,4])).to.equal(5);
			expect(km._distance([20,0],[21,0])).to.equal(1);
			expect(km._distance([20,20],[20,20])).to.equal(0);
		});

		/* The function '_max' takes as input an array and a function.
		   The function should return a number when any element of the
		   array is fed into it.  '_max' itself will return the value
		   from the array which is greatest when fed into the function
		   passed to max.

		   Example: knn._max(['a','bb','c','aaa','cc'], function(n){return n.length; }) will return 'aaa'

		   This is actually pretty much the same as the lodash max,
		   so if you want to you can just use that.
		 */
		it('has _max, which takes an array and a function and returns the element from the array for which what the function returns is highest', function(){
			var km = new KMeans();
			expect(typeof km._max).to.equal('function');
			expect(km._max([0,1,2,3,4,5,6], function(n){return n;})).to.equal(6);
			expect(km._max([0,1,2,3,4,5,6], function(n){return -n;})).to.equal(0);
			expect(km._max(['a','sas','asdasd','ssd'], function(n){return n.length;})).to.equal('asdasd');
			//With index
			expect(km._max([0,1,2,3,4,5,6], function(n, index){return -index;})).to.equal(0);
			expect(km._max([10,1,2,3,4,5,6], function(n, index){return -index;})).to.equal(10);
			expect(km._max([7,1,2,6,4,3,2], function(n, index){return index+n;})).to.equal(6);
		});

		/* The function '_clusterEvaluator' takes as input two things--an array of
		   centroids (vectors) and an array of training points (vectors).

		   It then evaluates how good the clustering indicated by the centroids
		   is, by returning the sum of the squares of the distances from each element in the training points
		   to the closest of the centroids; that is, it returns the sum of the squares of the
		   centroid to training-point distances.  A list of centroids which has a
		   smaller such sum is better than a list of centroids
		   which has a larger such sum.  This is because the goal of k-means is to, after all,
		   minimize this distance; the standard algorithm which we implement is merely
		   a way of trying to do so.

		   Note that you would NOT want to use this function in a straightforward way in
		   '_max' above, because the LOWER the value returned from this the 
		   better the clustering, while '_max' returns the HIGHEST value.  But you could use a function
		   that calls it.

		   Might want to use '_distance'.
		*/
		it('has _clusterEvaluator, which scores clusters according to the average distances from points to centroids in each', function(){
			var km = new KMeans();
			expect(typeof km._clusterEvaluator).to.equal('function');
			expect(km._clusterEvaluator( [[0,0],[100,100]],[[1,0],[0,1],[101,100],[100,101]] ) ).to.equal(4);
			expect(km._clusterEvaluator( [[0,0],[100,100]],[[2,0],[0,2],[102,100],[100,102]] ) ).to.equal(16);
			expect(km._clusterEvaluator( [[0,0]],[[3,0],[0,3],[0,-3],[-3,0]] ) ).to.equal(36);
		});

		/* The function '_averageLocation' takes an array of vectors and returns the mean
		   location of the vectors in the array.

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

		/* The following function, '_shiftCentroids', is rather the heart of k-means.  

		   It takes as input (1) an array of centroids, and an (1) array of all the training data.
		   Each of the elements of these are vectors--that is, simply arrays of numbers.

		   It outputs a new list of shifted centroids.  This list is produced by
		   dividing the training data into groups, each group consisting of the data points
		   closer to one centroid than to any other centroid, and then shifting that centroid
		   to the mean location of the groups.

		   This should probably be the longest function that you write.
		   I got it down to 12 lines; see if you can do better.

		   May want to use '_distance', '_averageLocation.''
		  */
		it('has _shiftCentroids, which takes centroids, and all the points and shifts centroids a step', function(){
			var km = new KMeans();
			expect(typeof km._shiftCentroids).to.equal('function');
			//Shouldn't shift anything at all.
			expect(km._shiftCentroids([[0,0],[100,100]],[[1,0],[0,1],[-1,0],[0,-1],[100,101],[101,100],[99,100],[100,99]])).to.eql([[0,0],[100,100]]);
			//Should shift one of the centroids, but not the other one.
			expect(km._shiftCentroids([[0,0],[100,100]],[[1,0],[0,1],[-1,0],[0,-1],[200,201],[201,200],[199,200],[200,199]])).to.eql([[0,0],[200,200]]);
			//Should shift both of the centroids.
			expect(km._shiftCentroids([[0,1],[101,100]],[[4,0],[0,4],[-4,0],[0,-4],[200,202],[202,200],[198,200],[200,198]])).to.eql([[0,0],[200,200]]);
		});

		/* The function '_haveShifted' takes two lists of vectors.
		   The n-th elements of each of which are taken to correspond to before
		   and after states for centroids shifted through the above.

		   If any of them have shifted more than a tiny amount, it returns true.

		   Might want to use '_distance.''
		 */
		it('has _haveShifted, which takes two arrays of centroids, and determines if they have shifted', function(){
			var km = new KMeans();
			expect(typeof km._shiftCentroids).to.equal('function');
			expect(km._haveShifted([[1,1,1]],[[1,1,1]])).to.equal(false)
			expect(km._haveShifted([[1,1,1],[2,2,2]],[[1,1,1],[2,2,2]])).to.equal(false)
			expect(km._haveShifted([[1,1,1],[2,2,2]],[[1,1,1],[2,2,2.4]])).to.equal(true)
			expect(km._haveShifted([[1,1,1.1],[2,2,2]],[[1,1,1],[2,2,2]])).to.equal(true)
			expect(km._haveShifted([[1,1.01,1],[2,2,2]],[[1,1,1],[2,2,2]])).to.equal(true)
			expect(km._haveShifted([[1,1],[2,2]],[[1,1],[2,2]])).to.equal(false)
			expect(km._haveShifted([[1],[2]],[[1],[2]])).to.equal(false)
			expect(km._haveShifted([[1],[2]],[[1],[2.1]])).to.equal(true)
		});

		/* If you follow the path lined out here, .cluster will return the best cluster
		   of several iterations of k-means.

		   This function, '_clusters', simply returns a single group of clusters produced by one 
		   complete iteration of k-means.  That is, it loops through Lloyd's algorithm until
		   the centroids have ceased moving or ceased moving by more than a certain amount.

		   This will probably use '_shiftCentroids' and '_haveShifted'.  You might find it useful to
		   write an ancillary function that helps you choose random initial locations from the
		   vectors passed in; I did this in a somewhat complex functional map, and there are
		   probably more straightforward ways to do it.

		   This is probably the second most difficult function to write, after _shiftCentroids.

		   It takes as input (1) the number of clusters whose centers it is trying to locate as well as
		   (2) the data it is trying to find clusters on.
		 */
		it('has _clusters, which returns a single cluster, but without trying multiple iterations of k-means', function(){
			var km = new KMeans();
			expect(typeof km._clusters).to.equal('function');
			//Returns the right number.
			expect(km._clusters(1,[[1,1],[0,0]]).length).to.equal(1);
			expect(km._clusters(2,[[1,1],[0,0]]).length).to.equal(2);
			expect(km._clusters(3,[[1,1],[0,0],[2,2]]).length).to.equal(3);
			//Returns in a sensical location
			var temp = km._clusters(2,[[1,0],[0,0]]);
			expect( distance([0,0], temp[0]) == 1 || distance([0,0], temp[0]) == 0 ).to.equal(true)
			expect( distance([0,0], temp[1]) == 1 || distance([0,0], temp[1]) == 0 ).to.equal(true)
		});

		/* The function '_manyClusters' invokes '_clusters' several times, and each time
		   adds the results of '_clusters' to an array it returns

		   It takes as input (1) the number of times to invoke '_clusters' and (2) the
		   number of clusters to tell '_clusters' to locate.

		   (It pulls the vectors that it will be passing to _clusters'
		   second argument from this.points.)
		*/
		it('has _manyClusters, which is returns an array of clusters', function(){
			var km = new KMeans();
			var typeA = randomPoints(100,[1,1],[0,0]);
			km.train(typeA);
			expect(typeof km._manyClusters).to.equal('function');
			expect(km._manyClusters(10,2).length).to.equal(10);
			expect(km._manyClusters(10,2)[0].length).to.equal(2);
		});

	});

	/*Alright, all of that prep work done, now for the rest of the problem.*/
	describe('The algorithm can find locations successfully with the function clusters.', function(){

		/* The function .clusters takes a number.  It returns an array of vectors,
		   each vector being the location of a centroid determined by the function.

		   To make this function accurate, you'll probably need to iterate through
		   the basic k-means algorithm several times and return the best result.

		   ------

		   If you slogged through the entirety of the above preperator work, here's
		   a bonus.  This is the entire amount of code needed for '.clusters',
		   assuming you pass all the above tests (and assuming that you do so in a
		   stable fashion).

		   KMeans.prototype.clusters = function(clusterNum){
				var self = this;
				return this._max( this._manyClusters( this.clusterAttempts, clusterNum ) , function(cluster){
					return -self._clusterEvaluator(cluster, self.points);
				});
			}

			Tada!  That's it.
		*/

		it(' can determine the location of two centroids with .clusters, being told there are two', function(){
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

		it(' can determine the location of three closer centroids, being told there are three', function(){
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

	/* So, "successfully" is in quotation marks because there is no very rigorous idea of what success is.
	   The below tests will always pass when run, assuming you give them sufficient
	   time to finish.  They produce, however, some data in the folder in which this runs,
	   which will display grouped members of the clusters produced by the algorithm.

	   In this context, "success" means that the each of the clusters seem to have something in common with 
	   each other.  It would be a little too much to hope for, with this rather crude algorithm, to have
	   all the members of each cluster be the same character.

	   Consider how well the algorith sorts the characters 1 and 0 into separate groups,
	   as well as the characters 5 and 9, and the characters 4, 6, and 8.  Some 
	   of these groupings are "better" than others.  Which and why?
	*/
	describe('The algorithm finds centroids for the MNIST data "successfully"', function(){

		it('finds centroids data consisting of the characters 1 and 0', function(done){
			this.timeout(10000);
			var knn = new KMeans();
			var someElements = mnist.zeroAndOne().map(function(n){return n[0]}).slice(0,100);
			knn.train(someElements)
			console.log('Finding clusters for images consisting of 1 and 0')
			var res = knn.clusters(2);
			console.log('Writing images...');
			writer.exportGrouped(res, someElements, done, "zeroOne")
		});

		it('finds centroids for data consisting of the characters 5 and 9', function(done){
			this.timeout(10000);
			var knn = new KMeans();
			var someElements = mnist.fiveAndNine().map(function(n){return n[0]}).slice(0,120);
			knn.train(someElements)
			console.log('Finding clusters for images consisting of 5 and 9')
			var res = knn.clusters(2);
			console.log('Writing images...');
			writer.exportGrouped(res, someElements, done, "fiveNine")
		});

		it('finds centroids for data consisting of the characters 4 and 6 and 8', function(done){
			this.timeout(10000);
			var knn = new KMeans();
			var someElements = mnist.fourAndSixAndEight().map(function(n){return n[0]}).slice(0,150);
			knn.train(someElements)
			console.log('Finding clusters for images consisting of 4 and 6 and 8')
			var res = knn.clusters(3);
			console.log('Writing images...');
			writer.exportGrouped(res, someElements, done, "fourSixEight")
		});

	});

});

/*EXTRA CREDIT: 

  As stated in the text of the workshop, there are two distinct clustering
  tasks: (1) determining where a given number of clusters are located in space
  given a particular data set and (2) determining how many clusters are located
  in a given space, given a particular dataset.  All of the above pertains to 
  the first task.  The extra credit pertains to the second.

  The basic task is to write an additional function, 'findClusters', which can 
  determine how many clusters are in a given set of data.  The tests below start
  out with very obvious separations of clusters (i.e., two clumps of data which
  are very, very far apart) and continue on to much more difficult separations.

  The basic strategy that you'll want to follow is to use the existing 'clusters'
  function to find the best set of 1, 2, 3... k clusters.  Each of these will 
  almost certainly have a smaller average centroid-training point distance than 
  the prior--this would be true even if the data were completely randomly
  distributed without any structure at all.  However, if there are clusters in the 
  data, then the rate at which the average centroid-training point distance decreases
  will drop once you've run out of clusters.

  For instance, if there are two tight clusters with centers at [0,0] and [0,50],
  then a clustering of 1 cluster will probably have an average centroid-training point
  distance of 25 or so.  A clustering with 2 clusters might have an average distance
  of .5--and a clustering with 3 might have an average distance of 0.45, with 4 might have
  0.4, and so on.  The distance decreases as the number of clusters increases, but after the
  average distance begins to decrease at a slow and steady rate then it probably
  means you have exceeded the optimum number of clusters.

  ...of course, most cases will not be nearly as clear as the above.
*/

xdescribe('Testing optional k-means functionality', function(){

	xdescribe('The algorithm can determine the number of clusters, not being told how many there are.', function(){

		/* The function 'findClusters' should take a number, which is the maximum
		   number of clusters it should search for.

		   It should return an array of centroids, just like 'clusters', but 
		   the array should have anything from 1 to the input number
		   centroids in it, depending on the most natural way to split
		   the data.

		   It took me about 25 lines of code to do this, although that
		   could have probably been minimized.
		 */
		it('can determine the number of clusters when there are two, very separate', function(){
			var knn = new KMeans();
			var typeA = randomPoints(100,[1,1],[0,0]);
			var typeB = randomPoints(100,[1,1],[50,0]);
			var both = typeA.concat(typeB)
			knn.train(both);
			var res = knn.findClusters(10);
			expect(res.length).to.equal(2);
		});

		it('can determine the number of clusters when there are three, pretty separate', function(){
			var knn = new KMeans();
			var typeA = randomPoints(100,[1,1],[0,0]);
			var typeB = randomPoints(100,[1,1],[5,0]);
			var typeC = randomPoints(100,[1,1],[3,4]);
			var all = typeA.concat(typeB.concat(typeC));
			knn.train(all)
			var res = knn.findClusters(10);
			expect(res.length).to.equal(3);
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
			expect(res.length).to.equal(4);
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
			expect(res.length).to.equal(5);
		});

		it('can determine the number of clusters when there are four, very, very close ones', function(){
			var knn = new KMeans();
			var typeB = randomPoints(100,[1,1],[1,0]);
			var typeC = randomPoints(100,[1,1],[0,1]);
			var typeD = randomPoints(100,[1,1],[-1,0]);
			var typeE = randomPoints(100,[1,1],[0,-1]);
			var all = typeB.concat(typeC.concat(typeD.concat(typeE)));
			knn.train(all)
			var res = knn.findClusters(10);
			expect(res.length).to.equal(4);
		});

	});

	/* This last section is really quite hard.


	   A lot of the ambiguity involved in the idea of a "cluster" comes in here,
	   as well as the problem that k-means is ill-suited to detecting certain kinds of cluster.

	   Anyhow, just do here what you did in the immediately prior section with the fake data.
	 */
	xdescribe('it can determine the number of clusters in the MNIST data as well', function(){

		it('can determine the number of clusters when there are two characters', function(done){
			//Fifteen second timeout...
			this.timeout(15000);
			var knn = new KMeans();
			var someElements = mnist.zeroAndOne().map(function(n){return n[0]}).slice(0,100);
			knn.train(someElements);
			var res = knn.findClusters(8);
			expect(res.length).to.equal(2);
			writer.exportGrouped(res, someElements, done, "clusterCountedZeroAndOne");
		});

		it('can determine the number of clusters when there are three characters', function(done){
			//Fifteen second timeout.  This can take a bit.
			this.timeout(15000);
			var knn = new KMeans();
			var someElements = mnist.zeroAndOneAndFive().map(function(n){return n[0]}).slice(0,100);
			knn.train(someElements);
			var res = knn.findClusters(8);
			expect(res.length).to.equal(3);
			writer.exportGrouped(res, someElements, done, "clusterCountedZeroAndOneAndFive");
		});

	});

});

