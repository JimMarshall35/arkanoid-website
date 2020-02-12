var ball = {
	scalefactor : 2,
	img : null,
	rect : null ,
	speed : 4,
	velocity : null,
	maxrot : 25,
	lastpos : null,
	speedincrease : 0.05,
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
		ball.rect = new Rect(new Vector2(canvas.width/2, canvas.height-50), 5* ball.scalefactor, 4*ball.scalefactor);
		drawlist[0].push(ball);
		updatelist.push(ball);

	},
	draw : function(){
		ctx.drawImage(this.img, this.rect.pos.x, this.rect.pos.y, this.img.width * this.scalefactor, this.img.height * this.scalefactor);
	},
	update : function(){
		this.lastpos = this.rect.pos;
		this.rect.pos = this.rect.pos.add(this.velocity);
		//console.log(this.rect.pos.x + " , " +this.rect.pos.y);
		//console.log(this.rect.left);
		//console.log(this.rect.left + this.rect.w);
		//console.log(this.rect.w);
		//console.log(canvas.width);
		if(this.rect.left < 0 || this.rect.left + this.rect.w > canvas.width){
			this.rect.pos = this.lastpos;
			this.bounce("vertical");
		}
		else if(this.rect.top < 0){
			this.rect.pos = this.lastpos;
			this.bounce("horizontal");
		}
		else if(Rect.testCollision(this.rect, paddle.rect)){
			this.rect.pos = this.lastpos;
			this.ballhitrotate();
		}
		let bouncetype = this.testcollisionblocks();
		if(bouncetype != null){
			this.rect.pos = this.lastpos;
			this.bounce(bouncetype);
		}
	},
	testcollisionblocks : function(){
		let hit = false;
		let block = null;
		for(let iblock of levelspawner.collidableblocks){
			if(Rect.testCollision(iblock.rect, this.rect)){
				hit = true;
				block = iblock;
				console.log("hit");
				break;
			}
		}
		if(hit){
			//console.log(block);
			//console.log(this.lastpos);
			let mycenter = this.lastpos.add(new Vector2(this.rect.w/2,this.rect.h/2));
			let blockcenter = block.rect.pos.add(new Vector2(block.rect.w/2, block.rect.h/2));
			let blockcenter2mycenter = mycenter.subtract(blockcenter);
			let m2t = new Vector2(block.rect.pos.x + block.rect.w/2, block.rect.pos.y).subtract(new Vector2(block.rect.pos.x + block.rect.w/2, block.rect.pos.y + block.rect.h/2)); 
			/*
			console.log(mycenter);
			console.log(blockcenter);
			console.log(blockcenter2mycenter);
			console.log(m2t);
			*/
			/*
			if(!block.gold){
				block.health--;
				if(block.health <= 0){
					//console.log("deleted");
					block.delete();
				}
			}
			*/
			let angle = m2t.getUnsignedAngle(blockcenter2mycenter);
			/*
			console.log("TRA" + levelspawner.toprightangle * (180/Math.PI));
			console.log("BRA" + levelspawner.bottomrightangle * (180/Math.PI));
			console.log("angle: "+angle * (180/Math.PI));
			*/
			this.rect.pos = this.lastpos;
			if (angle >= levelspawner.toprightangle && angle <= levelspawner.bottomrightangle){
				return "vertical";
			}
			else {
				return "horizontal";
			}
		}
		return null;
	},
	bounce : function(surface){
		this.speed += this.speedincrease;
		this.velocity = this.velocity.getNormal().multiplyByScalar(this.speed);
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