var lwip = require('lwip');

function toCol(val){
    return {
        r: Math.round(val),
        g: Math.round(val),
        b: Math.round(val)
    };
}

function distance(one,two){
	return Math.sqrt(one.reduce(function(old, _, index){return old + Math.pow( one[index] - two[index], 2) }, 0));
}

module.exports = {
	exportClassified: function(classified, done){
		var n = 0;
		var writeImages = function(currentSetOfImages, i){
			lwip.create(28*10+28,28*10+28, function(err, image){
				var batch = image.batch();
				if(err){return console.log("Something went wrong with image export: ", err);}
				var index = 0;
				for(var x = 0; x < 10; x++){
					for(var y = 0; y < 10; y++){
						if (index >= currentSetOfImages.length){
						}else{
							var currentImage = currentSetOfImages[index];
							var pixel = 0;
							for(var xx = 0; xx < 28; xx++){
								for(var yy = 0; yy < 28; yy++){
									batch.setPixel(x*28+xx, y*28+yy, toCol(currentImage[pixel]));
									pixel++;
								}
							}
							index++;
						}
						
					}
				}
				var title = 'classifiedAs'+String(i)+'.gif'
				batch.writeFile(title, function(err){
					if(err){console.log("Something went wrong with the image export in the final stages: ", err);}
					n++;
					if (n > 9){ done();}
				})
			});
		}

		for(var i = 0; i < 10; i++){
			var currentSetOfImages = classified.filter(function(n){return n[1] == i}).map(function(n){return n[0];});
			console.log("There are " , currentSetOfImages.length , " images ostensibly of " , i)
			writeImages(currentSetOfImages, i);
		}
	},

	exportGrouped: function(centroids, allData, done, str){

		var n = 0;
		var writeImages = function(currentSetOfImages, i){
			lwip.create(28*10+28,28*10+28, function(err, image){
				var batch = image.batch();
				if(err){return console.log("Something went wrong with image export: ", err);}
				var index = 0;
				for(var x = 0; x < 10; x++){
					for(var y = 0; y < 10; y++){
						if (index >= currentSetOfImages.length){
						}else{
							var currentImage = currentSetOfImages[index];
							var pixel = 0;
							for(var xx = 0; xx < 28; xx++){
								for(var yy = 0; yy < 28; yy++){
									batch.setPixel(x*28+xx, y*28+yy, toCol(currentImage[pixel]));
									pixel++;
								}
							}
							index++;
						}
						
					}
				}
				var title = str + '_groupedAs'+String(i+1)+'Of'+ centroids.length +'.gif'
				batch.writeFile(title, function(err){
					if(err){console.log("Something went wrong with the image export in the final stages: ", err);}
					n++;
					if (n >= centroids.length){ done();}
				})
			});
		}


		var belongs = allData.reduce(function(belongs, vector, index){
			var index = centroids.reduce(function(old, centroid, inner_index){
					var dist = distance(centroid, vector)
					return (old.distance < dist) ? old : {index: inner_index, distance: dist}; 
				}, {index: 0, distance: distance(centroids[0], vector) }).index;
			belongs[index].push(vector);
			return belongs;
			}, centroids.map(function(){return []}))

		for(var i = 0; i < centroids.length; i++){
			console.log("There are " , belongs[i].length , " images in group " , i)
			writeImages(belongs[i], i);
		}

	}
};