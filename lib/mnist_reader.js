var fs = require('fs');

module.exports = {

	allElements: function(){
		var flt = JSON.parse(fs.readFileSync('../lib/small_mnist_data.json').toString())
					.map(function(n){ return [n[0], n[1].indexOf(1)]; });
		return flt;
	},

	zeroAndOne: function(){
		var flt = JSON.parse(fs.readFileSync('../lib/small_mnist_data.json').toString())
					.filter(function(n){ return n[1][1] == 1 || n[1][0] == 1 } )
					.map(function(n){ return [n[0], n[1].indexOf(1)]; });;
		return flt;
	},

	fiveAndNine: function(){
		var flt = JSON.parse(fs.readFileSync('../lib/small_mnist_data.json').toString())
					.filter(function(n){ return n[1][5] == 1 || n[1][9] == 1} )
					.map(function(n){ return [n[0], n[1].indexOf(1)]; });;
		return flt;
	},

	fourAndSixAndEight: function(){
		var flt = JSON.parse(fs.readFileSync('../lib/small_mnist_data.json').toString())
					.filter(function(n){ return n[1][4] == 1 || n[1][6] == 1 || n[1][8] == 1} )
					.map(function(n){ return [n[0], n[1].indexOf(1)]; });;
		return flt;
	},

	zeroAndOneAndFive: function(){
		var flt = JSON.parse(fs.readFileSync('../lib/small_mnist_data.json').toString())
					.filter(function(n){ return n[1][0] == 1 || n[1][1] == 1 || n[1][5] == 1} )
					.map(function(n){ return [n[0], n[1].indexOf(1)]; });;
		return flt;
	},

}