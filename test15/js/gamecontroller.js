var gamecontroller = {
	lives : 3,
	readytolaunch : true,
	playing : false,
	lifemarkersf : 1.5*(sliderc.width/330),
	backbuttonimg : null,
	backbuttonrect : null,
	debug : false,
	gametimer : 0,
	last : 0,
	stopwatchstring : 0,
	init : function(){
		this.lives = 3;
		this.playing = true;
		this.gametimer = 0;
		this.last = d.getTime();
		this.stopwatchstring = sliderctx.measureText("00 : 00 : 000");
		this.backbuttonrect = new Rect(new Vector2(0,0),canvas.width/10,canvas.width/10);
		scene.currentscene.updatelist.push(this);
	},
	resetgametimer : function(){

	},
	update : function(){
		let delta = d.getTime() - this.last;
		this.last = d.getTime();
		this.gametimer += delta;
	},
	loadimage : function(){
		var backimg = new Image();
		backimg.onload = function(){
			gamecontroller.backbuttonimg = this;
			loadscreen.registerloadedfile();
			
		}
		backimg.src = backbuttonURL;
	},
	launchball : function(evt){
		if(paddle.state == paddle.transitions.dead){
			paddle.state.respawnready = true; 
		}

		for(let i=0; i<ballcontroller.balls.length; i++){
			if(ballcontroller.balls[i].stucktobat){
				ballcontroller.balls[i].stucktobat = false;
				audio.play(audio.sounds["bathit"]);
			}
		}
		if(paddle.state == paddle.transitions.laser){
			paddle.shoot();
		}
	
		
	}, 
	decrementlives : function(){
		this.lives--;
		if(this.lives < 0){
			this.lives = 3;
			levelspawner.init();
		}
	},
	drawinfopanel : function(){
		ctx.drawImage(this.backbuttonimg, this.backbuttonrect.pos.x, this.backbuttonrect.pos.y, this.backbuttonrect.w, this.backbuttonrect.h);
		sliderctx.font = "20px digital7";
		// let text = "dead";
		// if(ballcontroller.mainball){
		// 	text = "max speed: " + ballcontroller.mainball.maxspeed +" speed: " + ballcontroller.mainball.speed; // but only on mobile
		// }
		// if(this.debug){
		// 	text = "touched";
		// }
		let formatted = this.convertMS(this.gametimer);
		let m = (formatted.minute.toString().length == 1) ? "0"+formatted.minute.toString() : formatted.minute.toString();
		let s = (formatted.seconds.toString().length == 1) ? "0"+formatted.seconds.toString() : formatted.seconds.toString();
		let ms = formatted.millisecond.toString();
		switch(ms.length){
			case 1:
				ms = "00" + ms;
				break;
			case 2:
				ms = "0" + ms;
				break;
			default:
				break;
		}
		//console.log(ms);
		let text = m + " : " + s + " : " + ms;
		//let text = ball.speedincrease;
		//let info = sliderctx.measureText(text);
		//let dinfo = sliderctx.measureText("debug");
		//sliderctx.strokeText("debug", (sliderc.width/2) - (dinfo.width/2), (sliderc.height/3) - (20/2));
		sliderctx.strokeText(text, (sliderc.width/2) - this.stopwatchstring.width, (sliderc.height/3)*2 - (20/2) );
		sliderctx.stroke();
	
		//ball.maxspeed = canvas.width + (ball.speedincrease*20); // a hack - PUT IN PROPER PLACE! putting this line in the balls init function sets ball.maxspeed to NaN for some reason. 
		let srect = paddle.animationsobj.lifemarker;
		let draww = srect.w * 2;
		let drawh = srect.h * 2;
		let marginbetween = sliderc.width/40;
		let cursor = {x:sliderc.width/40, y:0 };
		for(let i=0; i< this.lives; i++){
			sliderctx.drawImage(paddle.img, srect.pos.x,srect.pos.y, srect.w, srect.h, cursor.x, cursor.y, draww, drawh);
			cursor.x += draww + marginbetween;
		}
	},
	convertMS : function( milliseconds ) {
	    var day, hour, minute, seconds;
	    seconds = Math.floor(milliseconds / 1000);
	    minute = Math.floor(seconds / 60);
	    seconds = seconds % 60;
	    hour = Math.floor(minute / 60);
	    minute = minute % 60;
	    day = Math.floor(hour / 24);
	    hour = hour % 24;
	    milliseconds %=1000;
	    return {
	        day: day,
	        hour: hour,
	        minute: minute,
	        seconds: seconds,
	        millisecond : milliseconds
	    }
	}
	
}
