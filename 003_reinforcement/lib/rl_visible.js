
var setUpControls = function(options){

	//Create agent which will be used everywhere.
	agent = new RLAgent()

	//Only should be done once.
	var move = { left: false, right: false }
	$(document).keydown(function(e){
		if ((e.keyCode || e.which) == 37){move.left = true; move.right=false; }
		if ((e.keyCode || e.which) == 39){move.right = true; move.left=false; }   
	});

	var displayInfo = {
		cart:{
			left: function(stateLeft, worldSize){return (500-100)*stateLeft/worldSize + 'px'; },	
		},
		stick:{
			left: function(stateLeft, worldSize){return 50+(500-100)*stateLeft/worldSize + 'px';},
			rotate: function(radians){ return radians * 180 / Math.PI; }
		}
	}

	var visibleGame = function(state){
		$('#cart').css('left', displayInfo.cart.left(state.player.loc, state.world.length));
		$('#stick').css('left', displayInfo.stick.left(state.player.loc, state.world.length));
		var stick = document.getElementById('stick');
		kcRotate(stick, state.player.ang);
	}

	//Starts a human playable game.
	var startHumanPlayable = function(){
		var humanAgent = {
			end: function(state, reward){},
			decide: function(state, reward){
				var temp = { left: move.left, right: move.right };
				move.left = false;
				move.right = false;
				return temp;
			}
		}
		BalanceGameSlow(humanAgent, visibleGame, function(){});
	}

	var startAIGame = function(){
		BalanceGameSlow(agent, visibleGame, function(){});
	}

	var aiPlaying = false;
	var timesTrained = 0;
	var startAITraining = function(){
		if (aiPlaying == false){
			aiPlaying = true;
			var internal = function(){
				BalanceGameFast(
					agent,
					function(){},
					function(){
						if (aiPlaying) {
							timesTrained = timesTrained + 1;
							$('#aiNum').html(timesTrained.toString());
							window.setTimeout(internal, 5)
						}
					}
				)};
				internal();
			}else{
				aiPlaying = false;
			}
		}

	$('#humanPlay').click(function(){ startHumanPlayable(); })
	$('#aiTrain').click(function(){ startAITraining(); });
	$('#aiPlay').click(function(){ startAIGame(); });

};


$(document).ready(function(){
	setUpControls();
});




//BalanceGameFast({}, userControlledPolicy, function(){points++}, endCallback);