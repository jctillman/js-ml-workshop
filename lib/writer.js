const Jimp = require('jimp');

const toHex = (val) => {
    const str = val.toString(16);
    return str + str + str;
}

const distance = (one,two) => {
	return Math.sqrt(one.reduce( (old, _, index) =>
		old + Math.pow( one[index] - two[index], 2), 0));
}

module.exports = {
	exportClassified: function(classified, done){

		let n = 0;
		const writeImages = (currentSetOfImages, i) => {
			const xSize = 28*10+28;
			const ySize = 28*10+28;
			new Jimp(xSize, ySize, (err, image) => {

				//Throw error if something went wrong.
				const errMsg = "Something went wrong with image export.";
				if(err){return console.log(errMsg, err);}

				let index = 0;
				for(var x = 0; x < 10; x++){
					for(var y = 0; y < 10; y++){
						if (index >= currentSetOfImages.length){
						}else{
							var currentImage = currentSetOfImages[index];
							var pixel = 0;
							for(var xx = 0; xx < 28; xx++){
								for(var yy = 0; yy < 28; yy++){
									let p = currentImage[pixel];
									image.setPixelColor(
										Jimp.rgbaToInt(p,p,p,255),
										x*28+xx,
										y*28+yy
									);
									pixel++;
								}
							}
							index++;
						}
					}
				}

				const title = 'classifiedAs'+String(i)+'.png'
				image.write(title, (err) => {
					if(err){ console.log(errMsg, err); }
					n++;
					if (n > 9){done();}
				});
			});
		};

		for(let i = 0; i < 10; i++){

			const currentSetOfImages = classified.
				filter((n) => n[1] == i).
				map((n) => n[0]);

			console.log("There are " , currentSetOfImages.length , " images ostensibly of " , i);
			writeImages(currentSetOfImages, i);
		}
	},

	exportGrouped: function(centroids, allData, done, str){

		let n = 0;
		const writeImages = function(currentSetOfImages, i){
			const xSize = 28*10+28;
			const ySize = 28*10+28;
			new Jimp(xSize, ySize, (err, image) => {
				
				const errMsg = "Something went wrong with image export.";
				if(err){return console.log(errMsg, err);}
				let index = 0;
				for(var x = 0; x < 10; x++){
					for(var y = 0; y < 10; y++){
						if (index >= currentSetOfImages.length){
						}else{
							var currentImage = currentSetOfImages[index];
							var pixel = 0;
							for(var xx = 0; xx < 28; xx++){
								for(var yy = 0; yy < 28; yy++){
									let p = currentImage[pixel];
									image.setPixelColor(
										Jimp.rgbaToInt(p,p,p,255),
										x*28+xx,
										y*28+yy
									);
									pixel++;
								}
							}
							index++;
						}
						
					}
				}
				const title = str + '_groupedAs'+String(i+1)+'Of'+ centroids.length +'.png'
				
				image.write(title, (err) => {
					if(err){ console.log(errMsg, err); }
					n++;
					if (n >= centroids.length){ done(); }
				});

			});
		}


		const belongs = allData.reduce(function(belongs, vector, index){

			index = centroids.reduce(function(old, centroid, inner_index){
					const dist = distance(centroid, vector)
					return (old.distance < dist) ? old : {index: inner_index, distance: dist}; 
				}, {indexx: 0, distance: distance(centroids[0], vector) }).index;

			belongs[index].push(vector);
			return belongs;
			}, centroids.map(function(){return []}))

		for(let i = 0; i < centroids.length; i++){
			console.log("There are " , belongs[i].length , " images in group " , i)
			writeImages(belongs[i], i);
		}

	}
};
