var lwip = require('lwip');

function toCol(val){
    return {
        r: Math.round(val),
        g: Math.round(val),
        b: Math.round(val)
    };
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

	exportGrouped: function(centroids, allData){

	}
};