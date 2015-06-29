(function(){

	var setInitialSettings = function(){
		//TODO: Add customization of settings.
		return {
			player: {				
				loc: 5,
				locSpeed: 0,
				ang: ((Math.random() - 0.5) / 10),
				angSpeed: 0
			},

			world: {
				length: 10,
				gravity: .4,
				friction: 0.99,
				movePower: .05,
				rotateSize: 10,
				stickLength: 100
			},

			dev: {
				logging: false,
				verboseLogging: false
			}
		}	
	}

	//This is supposed to rule all physical events.  It doesn't have
	//anything to do with victory conditions, though, and things like that.
	var physics = function(state, moves){

		//Player-controlled stuff.
		state.player.locSpeed = state.player.locSpeed - ((moves.left) ? state.world.movePower : 0);
		state.player.locSpeed = state.player.locSpeed + ((moves.right) ? state.world.movePower : 0);
		state.player.angSpeed = state.player.angSpeed + ((moves.left) ? state.world.movePower : 0) * state.world.rotateSize;
		state.player.angSpeed = state.player.angSpeed - ((moves.right) ? state.world.movePower : 0) * state.world.rotateSize;
		

		//Environment-controlled stuff.
		//Update locations -- movement
		state.player.loc = state.player.loc + state.player.locSpeed;
		state.player.ang = state.player.ang + state.player.angSpeed;
		//Friction
		state.player.angSpeed = state.player.angSpeed * state.world.friction;
		state.player.locSpeed = state.player.locSpeed * state.world.friction;
		//Gravity -- only influences the stick.
		state.player.angSpeed = state.player.angSpeed + Math.sin(state.player.ang / 180 * Math.PI) * state.world.gravity;

		return state;

	}

	var allPossibleMoves = [
		{left: false, right: false},
		{left: true, right: false},
		{left: false, right: true}
	];


	var rules = function(state, endCallback){
		var endIt = function(){
			state.dev.logging && console.log("Stick fell or ran off track.");
			endCallback(state);
		}
		if (state.player.loc >= state.world.length || state.player.loc <= 0){ endIt();}
	    if (state.player.ang <= -40 || state.player.ang > 40){ endIt();}
	}

	var startGame = function(agent, displayCallback, cb){
		var state = setInitialSettings();
		var i = window.setInterval(function(){
			var moves = agent.decide([state.player.loc-state.world.length/2, state.player.ang, state.player.locSpeed, state.player.angSpeed], 1, allPossibleMoves);
			state = physics(state, moves);
			displayCallback(state);
			rules(state, function(state){
				agent.end([state.player.loc, state.player.ang], -10, cb);
				clearInterval(i);
			});
		},40)
	};

	var fastGame = function(agent, displayCallback, cb){
		var state = setInitialSettings();
		var playing = true;
		while(playing){
			var moves = agent.decide([state.player.loc-state.world.length/2, state.player.ang, state.player.locSpeed, state.player.angSpeed], 1, allPossibleMoves);
			state = physics(state, moves);
			displayCallback(state);
			rules(state, function(state){
				agent.end([state.player.loc, state.player.ang],-10, cb);
				playing = false;
			});
		}
	};

	//Policy gets called every game-frame.
	//It gets called with 
	window['BalanceGameSlow'] = function(agent, displayCallback){
		startGame(agent, displayCallback);
	}

	window['BalanceGameFast'] = function(agent, displayCallback, cb){
		fastGame(agent, displayCallback, cb);
	}

})();