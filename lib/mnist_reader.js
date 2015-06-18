var fs = require('fs');

module.exports = {

	allElements: function(){
		var flt = JSON.parse(fs.readFileSync('../small_mnist_data.json').toString())
					.map(function(n){ return [n[0], n[1].indexOf(1)]; });
		return flt;
	},

	unknown: function(){
		var flt = JSON.parse(fs.readFileSync('../small_mnist_data.json').toString())
					.filter(function(n){ return n[1][1] == 1 || n[1][0] == 1 } )
					.map(function(n){ return [n[0], n[1].indexOf(1)]; });;
		return flt;
	}

}