var gamecontroller = {
	lives : 3,
	launchball : function(evt){
		console.log("launch");
		if(ball.stucktobat && evt){
			ball.stucktobat = false;
		}
	}, 
	decrementlives : function(){
		this.lives--;
		if(this.lives <= 0){
			this.lives = 3;
			levelspawner.reset();
		}
	}
	
}