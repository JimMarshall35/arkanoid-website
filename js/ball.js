var ball = {
	scalefactor : 2,
	img : null,
	rect : null ,
	speed : 4,
	velocity : null,
	maxrot : 25,
	loadimage : function(){
		var ballimg = new Image();
		ballimg.onload = function(){
			ball.img = this;
			console.log(ball.velocity);
			ball.init();
		}
		ballimg.src = ballURL;
	},
	init : function(){
		ball.velocity = new Vector2(0,-1).multiplyByScalar(this.speed);
		ball.rect = new Rect(new Vector2(canvas.width/2, canvas.height/2), 5* ball.scalefactor, 4*ball.scalefactor);
		drawlist[0].push(ball);
		updatelist.push(ball);

	},
	draw : function(){
		ctx.drawImage(this.img, this.rect.pos.x, this.rect.pos.y, this.img.width * this.scalefactor, this.img.height * this.scalefactor);
	},
	update : function(){
		this.rect.pos = this.rect.pos.add(this.velocity);
		//console.log(this.rect.pos.x + " , " +this.rect.pos.y);
		//console.log(this.rect.left);
		//console.log(this.rect.left + this.rect.w);
		//console.log(this.rect.w);
		//console.log(canvas.width);
		if(this.rect.left < 0 || this.rect.left + this.rect.w > canvas.width){
			this.bounce("vertical");
		}
		else if(this.rect.top < 0){
			this.bounce("horizontal");
		}
		else if(this.rect.testCollision(paddle.rect)){
			this.ballhitrotate();
		}
	},
	bounce : function(surface){

		switch(surface){

			case "horizontal":
				this.velocity.y *= -1;
				break;
			case "vertical":
				
				this.velocity.x *= -1;
				break;
			case "paddle":
				this.bathitrotate()
				break;
			default:
				console.error("bad input to bounce function");
		}
	},
	ballhitrotate : function(){
		this.velocity.y *= -1;
		var batcenter = paddle.rect.pos.x + (paddle.rect.w/2);
		var disttobatcenter = this.rect.pos.x - batcenter;
		var degrees = (disttobatcenter/(paddle.rect.w/2)) * this.maxrot;
		var radians = degrees * (Math.PI/180);
		this.velocity = this.velocity.rotate(radians);
	}
}