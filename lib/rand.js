module.exports = function(numbers, range, bias){
	var temp = [];
	for (var x = 0; x < numbers; x++){
		var point = [];
		for (var y = 0; y < range.length; y++){
			point.push(range[y] * Math.random() + bias[y]);
		}
		temp.push(point);
	}
	return temp;
}