var gamecontroller = {
	lives : 3,
	readytolaunch : true,
	launchball : function(evt){
		console.log("launch");
		console.log(paddle.state);
		console.log(this.readytolaunch);
		
		if(paddle.state == paddle.transitions.dead){
			paddle.state.respawnready = true; 
		}
		else if(ball.stucktobat && evt){
			ball.stucktobat = false;
		}
		if(paddle.state == paddle.transitions.laser){
			paddle.shoot;
		}
	}, 
	decrementlives : function(){
		this.lives--;
		if(this.lives <= 0){
			this.lives = 3;
			levelspawner.init();
		}
	}
	
}
