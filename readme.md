# A Gentle Introduction to Machine Learning 

## Overview

### Introduction to the Introduction

The purpose of this workshop is to give you a broad, accurate, although somewhat cursory understanding of machine learning.

More particularly, it aims to help you understand and program some of the common algorithms used in machine learning.  It aims to guide you through what is involved in training these algorithms and verifying this training.  And it aims to do all this over the subfields of supervised machine learning, unsupervised machine learning, and reinforcement learning.

If none of that made any sense, that's ok.  Part of the point of the workshop is to explain these and other terms.  I'll introduce them slowly from now on.

Machine Learning is generally a very mathematical field, which can make it somewhat intimidating.  This introduction tries to lower that mathematical barrier by assuming only that the student has (1) a good understanding of Javascript and a (2) decently good knowledge of high school algebra.  I will explain some terms from linear algebra before introducing particular algorithms, but these are all quite easy to grasp.

Ok.  So what is machine learning?

### What is Machine Learning?

Let's contrast the process of coding and using a machine learning algorithm with the process of coding and using a non-machine-learning algorithm.

Suppose you wished to write a non-machine learning algorithm that could detect when an image has a face in it.  You might come up with an idea for a program that searches for symetrical dark spots in the image, with a brighter spot above them and two brighter spots below them--that is, two eyes beneath a forehead and above cheeks.  (This is the basis of facial detection with [Haar-like features](https://en.wikipedia.org/wiki/Haar-like_features).)   You might try out the algorithm on some images, and tweak the settings to make it work better.  You could go back and forth between algorithm and data a few times.

But then, when you were satisfied with it, you could use the function in your program and you would be done.  If you had found the algorithm online, you could have just used it in your program without doing anything else.

The same task could be done by machine learning.  In this case, you'd also need to begin with an algorithm.  But instead of directly writing an algorithm that detects a face, you would write an algorithm that learns from experience.  After writing such an algorithm--or just choosing one from an ML (machine learning) library--you would then train it.  To train it, you would show it hundreds, or thousands, or millions of images with faces and images without faces, each correspondingly labelled as having or not having a face.  The algorithm would learn how to classify images as having or not having faces from this training data.  You would probably go back and forth between tweaking the algorithm and its settings and tweaking the training data.

Then, after writing the algorithm and training it, you would be able to use it in your program.  Even if you had found the algorithm online, you would still have needed to train it, unless you found an algorithm pre-trained to recognize faces.

So machine learning adds some stages to the process of going from nothing to a working product.  Non-ML algorithms are ready to go from the start, once the algorithm is done; ML algorithms need to be trained before they can be used.

### A More Formal Definition of ML

Here's a widely quoted, more formal definition of machine learning:

> A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E.

Or, to again put things more colloquially, a program using a machine learning algorithm produces measurably better results the more experience it gains.

### Kinds of Machine Learning Algorithm

Machine learning has broad aplicablity.  It's used for computer vision, stock trading, self-driving cars, voice recognition, facial recognition, bioengineering, and more.  So of course the field and the algorithms in it can be divided into further sub-categories.

The main way that machine learning algorithms are divided is by learning method.  To put this another way, the main way that ML algorithms are categorized according to the kind of experience they learn from.

There are other ways to categorize ML algorithms--according to their output, for instance.  But classification according to the kind of experience from which ML algorithms learn is probably the most fundamental.

When divided this way, there are three main categories of ML algorithm:
1. **Supervised Learning**
2. **Unsupervised Learning**
3. **Reinforcement Learning.**

Each of these categories presents distinct oportunities and challenges; the workshop will be built around implementing one of each of these.  So it's worth taking a little time to understand why they are distinct from each other.

### Supervised Learning

In supervised learning, the experience from which the algorithm learns is a set of paired example inputs and desired outputs.

The face-detection algorithm discussed above would be an example of supervised learning.  In it, the data that the algorithm trains on is a set of images together with a value indicating whether there is a face in the image or not.

Learning to recognize hand-written letters would be another example of supervised learning.  The training data in that case would be a set of images of individual hand-written characters, labelled with the correct character.  The algorithm would learn from this to correctly label new images of hand-written characters.  This is the problem we will work on in the first section of the workshop.

Both of the above are instances of machine learning that deals with *classification* problems.  In such problems, the input is some kind of data and the output is a label identifying that data as belonging to a particular type.  Supervised learning can also learn to solve *regression* problems.  A regression problem is one in which the desired output, instead of being a label, is a continuous value.

The recently-popular [Microsoft program](http://how-old.net/#) which tried to identify someone's age from a photo is an example of an attempt to solve a regression problem; the image is the input, and a continuous value is the output.  Another example might be a program that predicts stock prices from previous stock prices.  We won't be learning any regression algorithms, but it's important to know they exist.

K-nearest neighbors, support vector machines, naive Bayes, neural networks, and logistic regression are all very popular machine learning algorithms used for supervised learning problems.

### Unsupervised Learning

As the name indicates, the experience from which an algorithm learns in unsupervised learning is a set of example inputs--without any desired outputs attached to them.

The question that probably comes to mind is "What can one learn from an unlabeled set of data?"  It might seem impossible.  But it is nevetheless possible to learn to characterize the structure of such data in many interesting ways.

One thing one can do with unlabelled data is cluster analysis.  Supppose you were given a dataset with the heights, weights, shoe-sizes, 500m and 50m sprint times, and maximum bench-press weights of some college athletes.  You might find that there would be several different clusters of data points.  There might be a cluster of people who weighed more and had large bench-press weights, which might indicate the football players.  There might be another cluster of data around people with good 500m sprint times and lower weights, which indicates the track-and-field atheletes.  And so on and so forth.  Trying to count and locate such clusters can be very interesting, and is one of the things that unsupervised learning algorithms can do.

Suppose you were to feed a bunch of writing from an unknown alphabet (such as the supposed alphabet of the [Voynich manuscript](https://en.wikipedia.org/wiki/Voynich_manuscript)) into a supervised learning algorithm.  A good algorithm could figure out how many characters there were in the alphabet, and tell you what character belonged to each kind.

There are other things that can be done with unsupervised algorithms, but for now we'll stop at clustering.  K-means, principle component analysis, and neural networks can be used for unsupervised learning.

### Reinforcement Learning

Reinforcement learning is signficantly different from either supervised or unsupervised learning.

In reinforcement learning, the algorithm you write controls an agent inside some particular environment, which gets feedback in the form of a reward or punishment.  The agent then learns to act so as to maximize the reward it recieves.  Let me give an example from outside of machine learning to help you understand this.

Once some animal intelligence researchers decided to try to teach a group of dolphins to do [novel tricks](http://www.theguardian.com/science/2003/jul/03/research.science).  To do this, they began to reward dolphins with fish whenever the dolphin did some trick that they had not done before during the training session.  At first the dolphins recieved many fish, as they ran through their initial repertoire of tricks.  Then they slowed down, and seemed to get frustrated because they could not figure out what to do to receive a reward.  Finally, they seemed to hit on the idea--and immediately they began to do many things they had never done before, so they could get the reward.

The dolphins are like the agent controlled by your machine learning algorithm.  The fish are like rewards the environment doles out.  The problem, then, is for your algorithm to figure out what actions and what sequences of actions will result in the greatest reward--even though the algorithm is never explicitly told this.  It may be the case that actions with a great short-term reward result in long-term losses, which is another difficulty with this kind of learning.  As in supervised learing, there's a notion of the environment telling you what is right and what is wrong; unlike in supervised learning, though, the signals for right and wrong aren't tied to any particular input or output.

Reinforcement learning is one of the most complex and interesting types of machine learning, so I'll save any further discussion of it utill the section devoted to it.  Temporal difference learning, dynamic programming, and Monte-Carlo techniques are different methods of reinforcement learning.

## Prelude: Linear Algebra

### Introduction

Machine learning often depends on linear algebra.  The following will give you an extremely basic, theoretically barren, coding-oriented overview of the linear algebra necessary to get through the next few lessons.

### Vectors -- Introduction

Think of a vector as a bunch of numbers that indicate a position or direction.  The easiest way to represent a vector in Javascript is as an array of numbers.

A one-dimensional vector would be a single number that indicates position or direction along a single dimension, like a number line.  In writing, you could indicate that variable was a single-dimensional vector by writing **A** ∈ R<sup>1</sup>.  This means simply that **A** is vector composed of one real number.  Switching to Javascript array notation: [5] would indicate a position 5 units to the right of the origin of a number line, or perhaps a velocity of [5] from anywhere within the number line; a vector of [-2] would indicate a position 2 units to the left, or perhaps a velocity of from anywhere on the number line [-2].

A three-dimensional vector, similarly, would indicate position or velocity in three dimensions, such as along an X, Y, and Z location.  In writing, you could indicate that the variable **B** was a three-dimensional vector by writing **B** ∈ R<sup>3</sup>.  Switching to Javascript, again: The vector [0,0,0] would indicate something at the center of the coordinate system, or something completely motionless.  The vector [0,5,2] would indicate something zero units along the x-axis, five units along the y-axis, and one unit along the z-axis.  Or it could represent motion in the corresponding direction.

A three-dimensonal vector belongs in a three-dimensional space; a one-dimensional vector in a one-dimensional space; and, as we will see, an n-dimensional vector in an n-dimensional space.

### Vectors -- Positions and Directions

Vectors can be understood to represent (among other things) positions or velocities.

When thinking of them as indicating positions, it is natural to picture their base as sitting at the origin of the n-dimensional space, and their point at the location indicated by the vector itself.  On a two-dimensional plane, you could draw the vector [3,5] as an arrow reaching from [0,0] to [3,5].  This corresponds roughly with the way of thinking of vectors as positions.

Alternately, you could think of a vector as with its base at some other location, and it's point as stretching to a location elsewhere.  So you could draw the vector [3,5] as a line reaching from [10,10] to [13,15].  This corresponds more with the way of thinking of vectors as velocity.

Either way makes sense under different contexts--neither is more right than another.  For our purposes, though, vectors will generally be taken to siginify positions in n-dimensional space.

### Vectors -- In Higher Dimensions

Vectors can exist in four, ten, or a million dimensions; like vectors of smaller dimensionality, these can be thought of as indicating position in a higher-dimensional space.

This sometimes causes difficulty, because people think they need to try to visualize, or internally picture locations in a million-dimensional space.  This is, of course, impossible.

But we are related to mathematical objects rather as the medieval theologians said we were related to immaterial things: even if you cannot _picture_ them, you can still conceive of them and think about them.  Don't worry about trying to visualize a vector in a million-dimensional space.

All the _operations_ for vectors in a lower-dimensional space still apply to vectors in a higher-dimensional space, and so as long as you keep the operations straight you can still understand what is going on.  Whether you add, substract, find the norms for, or find hyperplanes defined by three, ten, or million dimensional vectors, all these operations are still defined the same way.

So what are those operations?

### Vector Addition

Vector addition allows you to add two vectors of equal dimensionality--that is, vectors that have the same number of numbers in them.  To do this you just add the first elements of each together, the second elements of each together, and so on, until you come up with a new vector composed of the sums of the corresponding elements of the first two.

Vector addition is not well-defined for vectors of different lengths -- it is meaningless to add a three-dimensional vector to a five-dimensional vector.

If we treat vectors as arrays of numbers, the following code adds two vectors.

    function vectorAdd(arrOne, arrTwo){
        return arrOne.map(function(_,index){return arrOne[index] + arrTwo[index]});
    }

Geometrically, adding vector **A** and vector **B** could be thought of as moving from the start of **A** to the end of **A**, then moving **B** units from the end of **A**.  [1,1] added to [2,5] makes [3,6], which is the same location you would end up at if you started at [0,0], moved [1,1] units, then moved another [2,5] units.

### Vector Substraction

Vector subtraction works pretty much the same way as vector addition.  When you subtract vector **A** from vector **B**, you make a vector whose first element is the first element of **B** less the first element of **A**, whose second element is the second element of **B** less the second element of **A**, and so on.  Again, subtraction is only well-defined for vectors of the same length.

Geometrically, this gives you a direction pointing from the position of the subtracted vector to the position of the vector substracted from.  So, for instance, if you subtract [3] from [1], you get the vector [-2], which points from [3] to [1].  If you subtract, say, [5,5] from [5,-5], then you get [0,-10], which points from [5,5] to [5,-5].

This code would subtract two vectors, again assuming we are representing vectors as arrays of numbers:

    function vectorSub(arrOne, arrTwo){
        return arrOne.map(function(_,index){return arrOne[index] - arrTwo[index]});
    }

### The Euclidean Norm

There are two more thing that you need to know about vectors before we can get to supervised learning.

The first is what the Euclidean norm of a vector is.

There are many different **norms** for measuring the length of vectors; a norm is generally speaking a function that assigns a positive length to any vector in any dimensionality.  Each norm takes a vector and returns a positive number.  The one that we'll use is called the **Euclidean Norm**.

To produce the Euclidean norm for a vector, take the square root of the sums of the squares of the elements.

So, for the vector [3,4], the Euclidean Norm is [5]:

    Math.sqrt(3*3+4*4) //returns 5

This formula should be familiar to anyone who has done geometry.  The Euclidean Norm is also defined for arbitrarily-dimensioned vectors, however.  The following returns the Euclidean norm for [1,1,1,1]:

    Math.sqrt(1*1 + 1*1 + 1*1 + 1*1); //Returns two 
    
The following Javascript code would return the Euclidean norm for any vector passed in to it.

    function euclideanNorm(arr){
        return Math.sqrt( arr.reduce(function(old, n){return old + n*n },0) )
    }

### Distance

The second thing is to know how you can also use the Euclidean norm to find the distance between the points indicated by two vectors, in any dimensionality.

    function dist(vectorOne, vectorTwo){
        return euclideanNorm(vectorSub(vectorOne, vectorTwo));
    }
    
It should now be clear why you can do this.  Remember, this distance is well defined for vectors with an arbitrarily large dimensionality as well as vectors in "normal" two and three dimensional spaces.

## Supervised Learning

### Introduction

In supervised learning, you'll recall, the training data consists of possible inputs paired with the desired output for that input.  From this training data, the algorithm attempts to generalize so that it can predict the correct output when it recieves input it has not seen before.

More concretely, a supervised learning algorithm might recieve images with cats in them and other images without cats in them, labelled as having cats in them and not having cats in them.  And from this training data it should be able to figure out whether a new image that it has never seen before has a cat in it or not.

The input, in the algorithm that we will consider, will be a vector of arbitrary length, standing for a specific location in N-dimensional space.  (This is a fairly standard way of representing input to a ML algorithm.)  The output will be a number, indicating a classification.  

### K-Nearest-Neighbors

K-nearest neighbors is the algorithm we will use to classify vectors of arbitrary length in N-dimensional space.

K-nearest neighbors is very simple.  The "k" in k-nearest-neighbors stands for an arbitrary constant such as 3 or 7, which will be set whenever the algorithm runs.  To explain how it works, I'll give an example of it in action.

Suppose that we want to be able to tell whether a particular student got into college on the strength of a football scholarship or a track-and-field scholarship from that student's weight and height.  To train an algorithm to determine this, we have gathered data for 100 athletes, each labelled by scholarship type and with weight and height information.  You could represent this in Javascript with an array like this:

    var trainingData = [
        [[220,72],0],
        [[160,69],1],
        [[250,74],0],
        [[150,65],1],
        ...
    ];
    
The first element of each element in the array is the vector giving the weight in pounds and the height in inches of the person in question; the second element is 0 if they are a football player and 1 if they are a track-and-field athlete.

Each column in a set of training data such as this is referred to as a **feature**.  There are two features in the above set of data; the first feature is given in pounds, and the second feature is given in inches.

Now, having been given this training data, I want to find out which class a new athlete belongs to.  I have his stats:

    var unknownAthlete = [230,70];

As the first step of the k-nearest-neighbors algorithm, I would find the distances between the point defined by this vector and the points defined by every vector in the training data.  To find the distance between the first training point and the point to be classified, first find the difference between the first pair of features (230-220) and square it.  Find the diffence between the second pair of features (70-72) and square it.  Add the two amounts, and find the square root; this is the distance between the first training point and the new point.  Do the same thing for all the other training points.

After finding the distance between the athlete we are trying to classify and all the training data for other atheletes, we could sort them from closest to furthest away.  And finally we could then look at the _k_ closest athletes.  We would then count up all the classifications among these _k_ nearest athletes.  The most common of these we would choose as the classification most likely for the athlete in question.

### K-Nearest-Neighbors, continued

Here's the algorithm, put a bit more--although still not very--formally:

1. When training the algorithm, the algorithm simply stores all of the training vectors it receives together with their classification.  It applies no processing to them at all.
2. On being given a point to classify, the algorithm finds the distance (the Euclidean norm) between that point and every one of the stored training points.
3. The algorithm then looks at the classification of the *k* closest training points.  It judges the point that it is attempting to classify to be of the class that is most common among these *k* nearest neighbors.

This algorithm is fairly simple, but can get surprisingly good results.

You may use this algorithm as a _binary classifier_--that is, as a classifier that chooses between only two different classes.  When doing this, it is common for people to use an odd number for the value of _k_.  This makes it impossible for there to be a tie.  When using the algorithm to classify more than two classes, you can make it choose randomly between tied classes or use some other ad-hoc measure to resolve conflict.

### Coding

If you look in the folder 001_knn, you'll find the test specs for k-nearest-neighbors as well as a mostly-empty file in which you can implement it.

Before testing, be sure to have npm installed in the top-level folder, and to have mocha installed globally.  Run "mocha knn_specs.js" from the command line to test it.  

There are more specific instructions and advice for how to complete it inside the specs.

You'll have a chance to see how well k-nearest neighbors does against some randomly-generated data.  And you'll also have a chance to see how well k-nearest neighbors does when trained against the MNIST data.  

Put briefly, the MNIST data is a collection of 60,000 labelled, 28 by 28 images of hand-written digits from 0 to 9.  Seeing how well an algorithm does against the MNIST data is a fairly standard way of testing out different supervised ML techniques.

I've already converted a subset of the MNIST data into a format easily accessible in Javascript: each image is represented as an array 724 of numbers, each standing for a pixel in the image.  Each number has a value from 0 to 255, depending on whether the corresponding pixel is black or white in the MNIST data.

When you uncomment tests for the MNIST data, a sub-program will create a set of images in 001_knn; each will display the images that your knn algorithm classed as 0s, or as 1s, or as 2s, and so on.

### Problems with K-Nearest-Neighbors

There are a few problems with k-nearest neighbors as we've implemented it.

One problem is that the runtime for each prediction increases proportionately with the amount of training data put in.  This is very problematic. Generally speaking, runtime should be faster than training, but in k-nearest-neighbors training is nearly instantaneous while runtime grows with the amount of training data.

Some algorithms get rid of unnecessary training points to try to mitigate this problem.  Read what Wikipedia has to say about the [Hart Algorithm](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm#Data_reduction) to see one algorithm that does this.

## Problems with K-Nearest Neighbors, continued

Another potential problem with k-nearest neighbors, as we've implemented it, has to do with data scaling.

In the example above with athletes, imagine if the heights of the athletes were given in miles rather than in inches.  If this were the case, then all of the heights would be very small--and so the amount that the heights contribute to the distances in KNN would be very small.  It will turn out that height is basically ignored entirely by KNN in such a case.

But we obviously don't want the results of the KNN algorithm to depend on the units of the data fed into it.  To avoid this problem, one thing you can do is **normalize** features.  When you normalize the data, you scale it so that the smallest value of any set of features is 0 and the greatest value of any set of features is 1, and every other value for that feature is something in between.  This means that, no matter how much variance there is naturally in different parameters in the training data, each parameter in the training data will count equally.

### Extra Credit / Other Algorithms

1. Implement the Hart Alorithm in your KNN object.  More specifically, implement a function which, when run, will remove all superfluous data points given the current training data and current k-size in the algorithm.  When reading the Wikipedia summary, remember that different points will remain relevant for different k-numbers, so the algorithm has to take that into account.
2. Implement a normalize function in your KNN object.  When run, it should scale each feature in the training data so that the largest vector is 1 and the smallest is 0.

## Unsupervised Learning

### Introduction

In unsupervised learning, the training data for the ML algorithm is not paired with some kind of correct output.  The goal is to try to find structure in this data despite this lack.

One of the ways to try to find structure in data like this is to cluster it.  Suppose you had never seen an armadillo, a giraffe, or a manatee.  If I were to give you a thousand photos of these three animals, all mixed together without any labelling, you still would be able to tell that the photos were of three kinds of things.  You would also be able to group each with its kind.  Clustering ML algorithms aim to do this kind of thing.

The only kind of unsupervised learning we'll be doing is clustering.  Unsupervised learning algorithms can do things other than cluster, however.

For instance, others can do latent variable analysis. In latent variable analysis, the ML algorithm attempts to determine if features in the training data can be summarized as the result of other, unseen, and fewer features.  If so, then the values for each of the visible features should be equally well summarized by a set of values for other, invisible features.  This both allows one to find possible causal factors for the data and to decrease the dimensionality of the data.

### Introduction to Clustering

There are two distinct clustering tasks:

1. Given a particular number of clusters to find in a set of data, find where these clusters are located.  For instance, being told that there are three kinds of letters in a set of images of human writing, group these images into three groups.
2. Given a particular set of data, find how many clusters are contained in it.  For instance, being told there are some number of letters in a set of images of human writing, determine how many letters there are in it.

The second task usually involves the first; trying to find how many clusters are contained in a particular set of data would probably involve figuring out where these clusters are located.  The first is the task we'll focus on, though.  So we'll start with k-means clustering, which is a method of solving the first task.

As an aside, you should note that the notion of "cluster" is vague.  The notion of what a "good" cluster is, is correspondingly vague; the task of counting how many clusters are in a given set of data is therefore also vague.  Suppose you had a data-set of 1000 hand-written characters: every character had been written either by Bob or Alice, and every character was either an "A" or a "D."  A's differ from D's in systematic ways--but the characters written by Bob probably differ from the characters written by Alice in systematic ways as well.  So should a clustering algorithm group the characters into two groups or into four?  It depends on the purpose of the algorithm; there is no universally right answer, only a right answer relative to a situation.  Such difficulties are one of the reasons that we're focusing on the first and not the second task.

### K-Means -- The Goal

The goal of k-means is to group the data, a set of n-dimensional vectors, into _k_ clusters that satisfy a particular property.

Each cluster is defined by one n-dimensional vector--so there are k cluster-defining vectors.  Every point in the data belongs to the cluster-defining vector to which it is closest.  (If you're familiar with the concept of [Vornoi Cells](https://en.wikipedia.org/wiki/Voronoi_diagram), k-means partitions space into n-dimensional voronoi cells.)

As I mentioned, however, these cluster-defining vectors should be arranged to satisfy a particular property.

Informally, the _k_ cluster-defining vectors should be arranged so that they are very close to the data points in their cluster.  More formally, the cluster-defining vectors should be arranged to minimize the squared distance from each data point to the vector to which it belongs.  

Let me put all of that into one sentence: A set of data perfectly clustered according to k-means would have _k_ cluster-defining vectors placed such that the sum of the squared distances from each data point to the cluster-defining vector to which it belongs would be the smallest possible amount.

You'll note that this defines k-means in terms of a goal, however.  A goal is not the same as an algorithm.  What would be some means of _finding_ these cluster-defining vectors, or at least finding vectors close to them?

### K-Means -- Lloyd's Algorithm

It is common in machine learning to attempt to aproximate an ideal solution with a more rough algorithm.

Lloyd's Algorithm is a way to come to an aproximation of the above ideal solution.  It is by far the most common way of attempting to come to such an aproximation, though, to the extent that often it is simply called the k-means algorithm.

This is the basic idea behind the algorithm.

1. Randomly choose k cluster-defining vectors within the space of the data, where k is the pre-determined number of clusters whose centers must be found.  (One way of doing this is to choose random points from the training data as starting locations.)
2. Assign each data vector to the cluster-defining vector to which it is closest.
3. Shift each of the k cluster-defining vectors so they are located in the midpoint of the data assigned to them.  (A vector located at the average location of a set of other vectors is a "centroid."  So another way to say this is to shift each of the k vectors so it is the centroid of the data that belongs to it.)
4. If none of the centroids shifted, or all of them shifted less than a particular amount, return those vectors as the cluster-defining vectors for the data.  Otherwise, go back to step 2 and repeat.

As stated, the vectors returned from the algorithm are known as "centroids."  In mathematics, a centroid occupies the average or mean position of all of the shapes around it in the region, just as the centroids above occupy the average or mean position of all the shapes to which they are closest.

This might be a bit difficult to understand.  If you would like a visual representation, [Wikipedia](https://en.wikipedia.org/wiki/K-means_clustering#Standard_algorithm) has a useful visual explanation of this sequence.

### K-Means - Local Minima

When the centroids have stopped moving, then Lloyd's algorithm has completed.  However, this does not mean that the algorithm has found the clustering which best minimizes the sum of the squared distances.  Or, to put this another way -- Lloyd's algorithm does not always produce the goal k-means sets forth.  It produces an aproximation, and often a bad aproximation.

Consider a dataset that consists of eight points, portrayed like this in beautiful ASCII art:

    ..                                      ..
    
    ..                                      ..
    
Suppose two centroids randomly chosen were placed something like this.

    ..                  C                   ..
    
    ..                  C                   ..
    
As it happens, they will both remain in place when k-means runs.   The top centroid is closest to the top four points, and at their average location, just as the bottom centroid is closest to the bottom four points, and at their average location.  So Lloyd's algorithm will keep them in place, and return them as cluster-defining vectors for the data.

Even so, a better location for each centroid would clearly be as follows.

    ..                                      ..
    C                                       C
    ..                                      ..
    
The clustering here is much tighter.  The sum of the squared distances of each point to the centroid to which it belongs is much less.  Nevertheless, there is no guarantee the k-means algorithm will come to this globally best solution.

Generally speaking, a poor solution that an algorithm can get "stuck" at while attempting to make incremental improvements is called a **local minima** or **local maxima**.  It makes sense to call it local minima right now, because we're trying to minimize the sum of squared distances, but the two ideas are otherwise the same.

Here's another instance of k-means converging on a local minima.  The initial locations are on the left; the final convergence is on the right.  You will note that although there are four points, the four clusters converged on by k-means are by no means the best possible clusters.

![Local minima](https://en.wikipedia.org/wiki/K-means_clustering#/media/File:K-means_convergence_to_a_local_minimum.png)

### Local Minima, continued

The problems caused by local minima (or local maxima) are not unique to k-means or unsupervised learning.  They happen in every field of machine learning. 

Many algorithms work by slowly shifting their parameters towards a better solution.  Just as k-means shifts centroids from location to location in an attempt to minimize the sum of squared distances, other ML algorithms shift their parameters about in an attempt to minimize or maximize some other amount.  Sometimes, however, the algorithm finds itself with parameters such that any small shift makes the solution worse--even though this particular set of parameters is not the absolute best.  This is a local minima or maxima.

Here's an analogy for a local maxima.  Suppose you're trying to maximize the amount of money that you earn.  You could work harder at your current job, which is in retail.  You could read books on persuasion to maximize the comission that you make on sales.  You could work more hours.  But after you've done all these things, you might find that you still do not earn nearly as much as your friend, Bob, who is a software engineer.  If you wish to make more money, you might have to change by more than small shifts; you might have to make a career change, and earn less than you currently do for a while.

Local minima or maxima in ML algorithms are like that.  These algorithms fail to find the best overall solution because they get stuck in acceptable local solutions, where any small change in an direction results in the situation becoming worse.  And because these algorithms work only by making small changes, they get stuck there.

Ways of dealing with local minima and maxima constitute an entire field.  Different ways are available depending on the algorithm in question.

One way to try to deal with local minima in k-means is to run Lloyd's algorithm several times; each time, start it with a different randomized set of centroids.  Each time you run it, save the solution.  After running it so many times, you could choose from these saved solutions the solution which has the smallest squared distance from the data points to the array.  There's a good chance this is not the globally best solution, but because it is the best of a sample, it is probably ok.

### Coding and Extra Credit

If you open the folder 002_kmeans, you'll see a spec file defining characteristics for k-means and an empty file in which to build the k-means constructor.

As before, the spec file can be run by typing "mocha kmeans_specs.js" at the command line.   More detailed instructions for what to do are included in the spec file itself.  You will need to read these comments.

When fully uncommented, the specs will also make images of the groups that the algorithm comes up with. 

There is also an extended extra-credit section to the spec file.  Feel free to try to do it, but don't be discouraged if you find it difficult.

### Problems

K-means will not locate clusters correctly in many cases.

Consider what happens in two dimensions, when there is an enormous circular set of data points, with a smaller, tighter, and also circular set of datapoints just a small distance from its edge, like a plannet skimming the surface of a red giant.  If you were to place one centroid in the center of the  small set, and another in the centroid in the center of the large set, the half-way point between them would be deep within the larger set of data.  So in such a case, k-means will classify a large part of the large set as belonging to the small set, erroneously.

To put the above paragraph more briefly, k-means must always mark the border between centroids at the half-way mark.  Sometimes this does not reflect the actual borders between clusters.  This is problematic.

K-means also has difficulty with any data which is not clustered roughly sphereically.  If data should cluster in a long narrow crescent, sweeping through 2d, 3d, or 784d space, k-means will not identify it as a single cluster, because clusters always consist in those points closer to a single centroid than to any other centroid.  So this,  too, is a significant problem with k-means.  Nonspherical clusters will result in many different elements being misclassified.

There are, of course, many other methods of clustering, which evade some of these problems. DBSCAN, OPTICS, and hierarchical clustering are clustering methods.

## Reinforcement Learning

### Introduction

In reinforcement learning, the ML algorithm learns how to achieve goals by interacting with an environment.

This task is very different than either of the former two kinds of machine learning.  So we will approach the ideas involved in this gradually.  Throughout it all, though, it is good to keep in mind the essence of the task: Reinforcement learning is about exploring an environment to figure out how to achieve particular goals.  

I'll begin by describing a simplified learning problem, which differs from the full reinforcement learning problem in that it does not involve multiple states.  After explaining an algorithm that solves it, I'll move to the full reinforcement learning problem.

### N-Armed Bandit

Imagine a one-armed bandit: a casino-style gambling maching, the kind with the spinning wheels of symbols.

Suppose that instead of having a single arm it has _n_ arms.  Each of these arms would return some some particular reward on average.  The first arm, for instance, might average 5 on each pull, while the second arm might average 10, and so on.  Of course, each arm only returns these rewards on average: Different individual pulls on the first arm might return 0, or 30, or 0.5, or some other number.

(Suppose also, contrary to fact, that it is possible to win a positive amount on average while playing against the machine.)

You do not know what any arm averages when you start playing the _n_ armed bandit.  Your goal, however, is to maximize the reward you receive over some finite number of pulls--say, a thousand pulls.

If you knew which arm averaged the most over time, then you could simply use that arm each time to maximize your reward over time.  So you probably want to try to determine which arm returns the most on average.  Furthermore, the more sure you are about which arm gives the highest average reward, the more sure you can be that you are pulling the arm most likely to maximize your reward over time.

The only way to be sure about which arm gives the highest average reward, however, is to try each arm.  The only way to be very sure it to try each arm a great deal.  The more time you spend trying each arm, however, the less time you have to use whatever arm you currently judge best.  So the more time you take trying to be sure about which arm is the best, the less time you have to pull the arm you currently judge to be best.

This is the explore / exploit tradeoff.  If you want to use the knowledge you have, you are generally giving up on a chance to gain new knowledge.  If you want to gain new knowledge, you are generally giving up a chance to use the knowledge you have.  This tradeoff is fundamental to reinforcement learning, to the n-armed bandit problem, and many real-life problems.

A doctor who has several experimental treatments for a potentially-fatal disease, for instance, is faced with the same basic difficulty.  Will he use the most promising treatment from the start, and thereby risk that he is not using a much better treatment?  Or will he try many different treatments, and accept that many people will not get the treatment he currently judges best?  What should he do to best preserve life?

### ɛ-Greedy

There are many ways to approach the n-armed bandit problem and the explore / exploit tradeoff, but I'm going to focus on a simple method: ɛ-greedy.  That's pronounced "epsilon-greedy."  (Epsilon is a Greek character typically used by mathematicians to indicate a small amount.)

The ɛ-greedy algorithm is a slightly more complex version of a simple greedy algorithm.  A greedy algorithm would simply maintain an estimate of which arm seems best, and always choose it.  It would estimate which arm is best by looking at the average of the amounts each arm has returned so far.

The ɛ-greedy algorithm does nearly the same thing, but with a few differences.  Here's the algorithm:

1. Initialize starting guesses for the average value of each of the _n_ arms of the n-armed bandit.
2a. With probability (1-ɛ), choose whatever arm you estimate to have the highest average value, or choose randomly among those which are tied for the highest average value.
2b. Otherwise, with probability ɛ, choose any of the  _n_ arms at random.
3. After either choice, update the average value for the arm that you picked.
4. Go back to 2, until you have run out of choices.

In short, the ɛ-greedy algorithm is just like a greedy algorithm most of the time: with probability (1-ɛ), it simply chooses whatever arm currently appears to it to be best.  But some of the time, it will also choose a random action.  So it usually exploits, but with probability ɛ explores.  This means that over an (infinite) amount of time, its estimate for the average value returned by each arm must converge to the actual value.

So much for the _n_ armed bandit.  Let's move on to the full reinforcement learning problem.

### Reinforcement Learning -- Introduction

The _n_ armed bandit is an example of a _non-associative_ learning problem.  It is non-associative because good and bad actions are not associated with any particular situation or state of the world.  An action with low expected reward will always have low expected reward, and an action with a high expected reward always will have a high expected reward.  The full reinforcment learning problem, however, is _associative_.  The world or the agent in the world can be in different states, and actions that are likely to result in high returns in some states will not in other states.  Steering right while driving is sometimes a good move, and sometimes not; it depends on what kind of a situation you're in.

In a full reinforcement learning problem, the thing learning and making decisions, which is controlled by the algorithm, is called the _agent_.  The thing it interacts with is called the _environment_.  Agent and environment interact over the course of a series of discrete time steps.  The series terminates when the training episode ends, although there are usually many training episodes.

(Reinforcement learning can be divided into both _episodic_ and _continous_ learning, but to simplify matters I'm going to act as if all learning took place in episodes.  Episodes are like games in chess; everything about the environment gets reset after an episode ends, although the agent can still retain knowledge that it has acquired.)

### Reinforcement Learning -- Terminology

As stated, agent and environment interact over a series of discrete times steps.  These steps are usually denominated by a lower-case 't'.

In each time step during the episode, the agent receives some representation of the environment's _state_.  This is usually indexed by the time-step that the agent recieves it, and so is called s<sub>t</sub>.  On the basis of this state, the agent selects an _action_ which is similarly denominated as a<sub>t</sub>.  One time step later, the agent recives a new state s<sub>t+1</sub> with reward r<sub>t+1</sub>; it decides to perform action a<sub>t+1</sub>, and so on.

There are a few constraints placed on these variables.  The reward is always a single real number.  The goal of the agent, of course, is to maximize the reward received over time, not the reward recieved in any particular time-step.  Machine learning agents therefore will try to create a _value function_ that help them estimate the cumulative reward that will follow any particular state, or any particular action in any particular state, and thereby help them choose actions likely to result in great reward over time.

Another assumption many algorithms make is that there are a finite number of states.  In cases where the raw state is defined by real numbers, of course, there could easily be an infinite number of states--there is room for infinite real numbers between 0 and 1.  So in many cases the state is made discrete (and potentially finite) by rounding each number defining it to the nearest integer, or tenth of an integer or whatever is suitable fo the application at hand.  This is something that you'll do in the exercise.

Here's an example of a reinforcement agent.  Suppose our agent were a program meant to handle elevators in a building.  The state could be an array, some of whose values are 1 or 0 depending on whether particular up / down buttons are pressed, and some of whose values indicate the current elevation and speeds of each elevator.  The action selected by the agent could be lifting, lowering, or opening any elevator.  The reward would be some kind of signal inversely related to the time between button-depression and door-opening at each building floor: it would be higher the shorter this period was.  The agent would then aim to maximize the reward over time by lifting, lowering, or opening the elevators to minimize wait-time. 

### Markov Property

Let me talk about state for a bit more.

A state signal, s<sub>t</sub>, is said to satisfy the "Markov Property" when it compactly summarizes all relevant information from past states in the environment.

What does it mean to "compactly summarize all relevant information"?  Suppose I were to tell you the location of all the chess pieces on a board, and ask you what the best move was.  Any further information about all the previous locations of these pieces at earlier game-states would be superfluous--it would be unnecessary for determining what the best move is now.  So the state signal of the location of all the pieces of the board is Markov.

Similarly, the location, velocity, and spin of a cannonball is Markov--after you know all these things about it, any further information about its past location, velocity, or spin is irrelevant to predicting its future.

To put things in a mildly technical fashion, a state signal is Markov if the probability that s<sub>t+1</sub> = s' given s<sub>t</sub>, is the same as the probability that s<sub>t+1</sub> = s' given s<sub>t</sub> and any arbitrary set of s<sub>t-1</sub>, s<sub>t-2</sub>... s<sub>t-n</sub>.

A number of learning algorithms are guaranteed to converge to the best possible solution, given that the state signal they work from satisfies the Markov property. In fact, many if not most real-life state signals do *not* satisfy the Markov Property; the problem we will solve does not have a discrete state signal that does this--although the continuous state signal does.  But the algorithms that are guaranteed to work with a Markov state-signal nevertheless also often work moderately well with a state-signal that is not Markov.

Remember that if the state has continuous values, as the states will in the problem we'll be working with, then there are obviously an infinite number of different states possible.  There are a few ways of dealing with this: We'll round each continuous value to a discrete value, so that there are a finite rather than infinite number of different states possible.

### Policies

There are a few more terminological and conceptual things we need to get over before we can get to the algorithm.

A _policy_ is a mapping from every possible state to an action.  Another way to think of this is to say that a policy is a function that takes a state and returns an action.  Every agent needs to have a policy, because every agent needs to be able to decide what to do on being given any particular state.  A policy is usually denominated by the character 𝜋.

Policies can be either _stochastic_ or _determinate_.  A determinate policy always returns the same action on being given the same state. One writes a determinate policy as a function taking a single state, 𝜋(s), which then returns some action a.  On the other hand, a stochastic policy will sometimes return some particular action from a state and sometimes return some other particular action on being given the same state.  One can write a stochastic policy as a function taking two variables, 𝜋(s,a), which returns the probability that the policy will follow action a on being given state s.

This may sound somewhat complex, but is really very simple.  When we say a professor has a policy of penalizing five points for every day a paper is late, we're informally indicating how 𝜋(s) maps onto a set of actions for the professor.  A policy for a learning agent does exactly the same thing.  Agents which learn to drive cars have likely policies indicating that they should step on the brakes before red lights, and press the gas on seeing green lights.

### Action-Value Functions

Some policies are better than other policies.  That is, following some policies will lead to a greater cumulative reward from the environment, over time, than following other policies.   More formally, one policy is better than another if following the better policy from any state results rewards in greater or equal to those which occur from following the worse policy from any state.

The policy of waking up when your alarm goes off is better, at least so far as rewards recieved from one's employer, than the policy of hitting snooze two dozen times.

Each state has a different expected value, then, beneath different policies.  Following a particular policy from one state might result in a total subsequent reward of 58, while following a different policy from that same state might result in a total subsequent reward of 1432.

Similarly, taking some action from any some state has a different expected value beneath different policies.  Performing an action in one state beneath one policy might result in a total subsequent reward of 213, while performing the same action from the same state beneath another policy might result in a total subsequent reward of -231.

Agents often try to estimate the _action-value function_, which gives this latter value for a policy--that is, the action-value function gives the cumulative expected reward which will follow from taking any particular action in any particular state for a particular policy.   Terminologically, the action value function is written as Q<sup>𝜋</sup>(s,a), which is a bit less verbose.  This stands for the expected total return beneath policy 𝜋 of making action a in state s.  Trying to estimate this value for an arbitrary policy is central to trying to find the best overall policy.

### Monte Carlo Value Estimation

Suppose we have some arbitrary policy .  Suppose furthermore it is a "soft" policy--that is, for every possible action in every possible state, there is a non-zero chance of that action being executed.  To put this in another way, for a soft policy 𝜋(s,a) > 0 for all states and all actions possible from each state.

Given such a policy, how can we determine the action-value function (Q<sup>𝜋</sup>(s,a)) relative to that policy?  The problem of answering this question is known as the _prediction problem_ or the task of _policy evaluation_.  Different reinforcement learning algorithms often differ chiefly by having different ways of answering this question.  We will answer it with a Monte Carlo method, which has the advantage of not requiring you to already know the dynamics of the environment--that is, it does not require you to know the probability that acting in a particular way in a particular state will lead to some other state.  Our technique does require that you have the ability to act repeatedly in the environment, however.

Here's how it goes.

Suppose that we run through a training episode using soft policy 𝜋 to make decisions.  Suppose, furthermore, at each step in the episode we save (1) state-action pair for that step and (2) the reward in that step.  After the training episode concludes, we could run through each saved step from beginning to end.  While going through the steps, every time we find a state-action pair that we had not seen until that point in the training episode, we could sum up the total rewards which ocurred _after_ the this ocurrence of that state-action pair.  This summed value could be pushed to an array specific to that state-action pair.  This process could then be repeated through many training episodes.

After each training episode, an average could be taken from the arrays specific to each state-action pair and this could be used to approximate Q<sup>𝜋</sup>(s,a) for that policy. 

Because the policy is soft, over time this procedure is guaranteed to visit every state-value pair.  Each value which it pushes to the arrays specific to each state-action pair is the the total cumulative reward following that state, over one single episode.  As the number of episodes increases, the average of each of these arrays is then guaranteed to approach the action-value function Q<sup>𝜋</sup>(s,a) for that state and action for policy 𝜋.  And this is a Monte-Carlo method of estimating the action-value function over the course of many training episodes.

Let me write out the algorithm explicitly.  I presuppose beneath you have a policy 𝜋 such that 𝜋(s,a) > 0 for every state and every action.

1. Initialize a 'returns' object and an 'state-action' object.  
2. For each training episode.
	1. Initialize an array 'steps'.
	2. Run through the episode to the end, while using policy 𝜋.  For each time step, push the state-action pair and the reward for that time step to 'steps'.
	3. Step through each of the steps saved after running through the episode.  Every time you encounter a state-action pair for the first time, push the sum of the rewards following that state-action pair to the array in the object 'returns' specific to that state-action pair.
	4. Let the properties in the 'action-value' object equal the average of the the arrays beneath the correspoding properties in the 'returns' object.
3. Conclude after a set number of iterations, or after the values in the 'action-value' object cease changing more than a small amount.

This will give you an aproximation of the action-value function for all states beneath a set policy.

### Being Greedy Again

The prior section explained how to estimate the state-action function for any soft policy by using Monte-Carlo methods.  But it's not enough to estimate the action-value function for a policy.  We need to be able to improve the policy as well.

Suppose now that the specific policy 𝜋 which the learning agent is using, and for which it has estimated the action-value function, is the ɛ-greedy policy.  The ɛ-greedy policy was introduced in the context of a the _n_ armed bandit, so let me take a second to explain what this would mean.

On each time step, the ɛ-greedy policy is given a particular state.  It wishes to take the action which will result in the greatest value--so, in this context, this means that it will look a the values in the action-value function accessible from that state.  To rephrase the prior sentence: It will examine the action-value (Q<sup>𝜋</sup>(s,a)) function values for (s, a<sub>1</sub>), (s,a<sub>2</sub>), and so on, until it has looked at the values of the action-value function for each of the possible actions from that state.  It will then (with probability 1-ɛ) choose the action with the greatest expected cumulative reward.  With probability ɛ, of course, it will choose any of the actions available to it randomly.

This should be a little confusing.

The above presupposes, you'll notice, that there already is some kind of an action-value function that the ɛ-greedy policy is using.  But the process of estimating the action-value function for a given policy, in the prior section, presupposes that there already is some policy for which the the alogorithm is finding the action-value function.  This seems a little problematic.  As the action-value function changes, it seems like the ɛ-greedy policy will change; and as the ɛ-greedy policy changes, it seems like the action value function relative to that policy will change as well. 

### General Policy Iteration

The aforementioned apparent problem is actually one instance of a general reinforcement-learning algorithm called general policy iteration. 

In general policy iteration, one starts with an arbitrary policy and an arbitrary action-value estimate for that policy.  One then alternates improving (1) the action-value function relative to the arbitrary policy and (2) making the policy greedy relative to that action-value function.  These two changes work against each other, in the sense that each provides a shifting target.  But they work together because, in the end, the only stable position for either of them is (1) the optimal action-value function, which gives the value of each state beneath the optimal ɛ-greedy policy and (2) the optimal ɛ-greedy policy.

### Complete Monte Carlo Algorithm

Let me explain the full algorithm

1. Initialize the 'returns' object and the 'action-value' object.  They can both be empty to start off with.
2. For each training episode.
	1. Initialize an empty array, 'steps'
	2. Run through the entire episode, while following the ɛ-greedy policy.  (In cases where the state-action object is empty for a particular state-action pair, fill it with a default value.)  As you run through the episode, push the state-action pair that you follow and the reward particular to each state to the array steps.
	3. Step through each of the steps saved after running through the episode.  Every time you encounter a state-action pair for the first time, push the sum of the rewards following that state-action pair to the array in the object 'returns' specific to that state-action pair.
	4. Let the properties in the 'action-value' object equal the average of the the arrays beneath the corresponding 'returns' properties.
3. Conclude after a set number of iterations, after the values in the 'state-action' object cease to change more than a small amount.

In effect, what this does is to start off with a policy that is random--the ɛ-greedy policy will initially just choose random actions, because its estimate for the every move will simply be the default value.  But those random actions which result in higher returns will soon begin to be chosen more often than those random actions which result in lower returns.  So the actions will steadily become less random, although they will always remain random to such an extent that they never stop exploring entirely. 

### Coding

As before, you'll find a set of specs and a folder to modify in the folder specific to this section.

Unlike before, passing the specs isn't really the point of this part of the exercise.  There aren't as many, and passing them doesn't mean you've passed the exercise.

Instead, if you open up "display.html," you'll find a small game.  Click on the line that lets you play as a human, and see how easy / difficult it is.  The basic idea is to balance a stick on top of a cart by moving the cart back and forth on a limited track.  The episode ends when the stick falls beneath a certain angle or the cart runs into the edge.  When training your program will recieve a reward of 1 for every step it does not bump into the end of the track or have the stick fall down, and a reward of 0 when this happens.

The object, then, is to write write a constructor function for an agent which will be trained repeatedly in the environment.  Clicking the train line just runs your agent through the environment many times very quickly.

This is difficult.  One thing you should be aware of is that it is easiest to start off with an agent that ignores some of the information the state signal gives it.  This is summarized more in the notes for the specs.

## Further Resources

### Resources

This was only a very, very superficial introduction to machine learning, which has left out vast quantities of the deep mathematical roots of the subject.

Here are a few things to follow up with if you're interested in more.

The first thing would be to gain a really good knowledge of statistics, linear algebra, and calculus.  None of the below absolutely require these things, but they're going to be extremely useful for anyone studying ML.

One thing that this tutorial has not covered at all was neural networks.  You can find a really superb and exceedinly gentle introduction to neural networks at (this)[http://neuralnetworksanddeeplearning.com/index.html] website.  It uses Python rather than Javascript, but if you want to do Machine Learning you're going to have to learn something other than Javascript anyway; Python is one of several languages that a fair amount of ML work is done in.

Wikipedia is actually a great resource for ML algorithms.  Using Wikipedia to implement a perceptron, a naive Bayesian classifier, or some similar supervised learning algorithm would be a good exercise which should be within the range of people who have completed this tutorial.

(Udacity)[www.udacity.com] has several machine learning and artificial intelligence courses.  Several of them focus too much on using libraries and not sufficiently on comprehension, to my mind, but it is nevertheless a very good resource.  They offer a data science nanodegree, which should go into some of these subjects at least moderately deeply.  Other MOOCs are supposed to be good as well, although I haven't had time to try them.  

One thing to be aware of is, as far as I can tell, most machine learning seems to focus on supervised and unsupervised learning; reinforcement learning does not fit as well within the "big data analysis" paradigm which seems to dominate machine learning classes.  So it seems unlikely that you'll learn reinforcement learning techniques unless you consciously set forth to learn them, unless I am mistaken.  Barto and Sutton's "Reinforcement Learning: An Introduction," has been an absolutely invaluable source to me while writing this tutorial, and I highly recommend it as a basic introduction to the topic.

Finally, if you're interested artificial intelligence simply speaking, Russel and Norvig's "Artificial Intelligence: A Modern Approach" is probably the place you want to start. 

