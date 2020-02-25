var ball = {
	drawlayer : 1,
	scalefactor : 1.5 * (c.width/330),
	img : null,
	rect : null ,
	speed : 4 * c.width/330,
	velocity : null,
	maxrot : 25,
	lastpos : null,
	speedincrease : 0.05 * c.width/330,
	stucktobat : true,
	bat2me : null,
	loadimage : function(){
		var ballimg = new Image();
		ballimg.onload = function(){
			ball.img = this;
			console.log(ball.velocity);
			ball.init();
			loadscreen.registerloadedfile();
		}
		ballimg.src = ballURL;
	},
	init : function(){
		this.scalefactor = 1.5 * (c.width/330);
		this.velocity = new Vector2(0,-1).multiplyByScalar(this.speed);
		let pos = new Vector2(paddle.rect.pos.x + paddle.rect.w/2, paddle.rect.pos.y - (4*ball.scalefactor) - 1);
		this.rect = new Rect(null, 5* this.scalefactor, 4* this.scalefactor);
		this.sticktobat();
		drawlist[this.drawlayer].push(ball);
		updatelist.push(ball);
	},
	draw : function(){
		ctx.drawImage(this.img, this.rect.pos.x, this.rect.pos.y, this.img.width * this.scalefactor, this.img.height * this.scalefactor);
	},
	sticktobat: function(){		
		this.rect.pos = new Vector2(paddle.rect.pos.x + paddle.rect.w/2, paddle.rect.pos.y - (4*ball.scalefactor) - 1);
		this.bat2me = this.rect.pos.subtract(paddle.rect.pos);
		this.stucktobat = true;
		this.speed = 4;
	},
	update : function(){
		if(!this.stucktobat){
			this.lastpos = this.rect.pos;
			this.rect.pos = this.rect.pos.add(this.velocity);
			if(this.rect.pos.y > canvas.height && paddle.state != paddle.transitions.dead && paddle.state != paddle.transitions.init){
				console.log(paddle.state);
				paddle.state.transition2dead();
			}
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
		}
		else{
			this.rect.pos = paddle.rect.pos.add(this.bat2me);
		}	
	},
	getoverlaparea : function(rect1,rect2){
		let l1 = new Vector2(rect1.pos.x, rect1.pos.y + rect1.h);
		let r1 = new Vector2(rect1.pos.x + rect1.w, rect1.pos.y);
		
		let l2 = new Vector2(rect2.pos.x, rect2.pos.y + rect2.h);
		let r2 = new Vector2(rect2.pos.x + rect2.w, rect2.pos.y);
		areaI = (Math.min(r1.x, r2.x) - Math.max(l1.x, l2.x)) * (Math.min(r1.y, r2.y) - Math.max(l1.y, l2.y));
		return areaI;
	},
	testcollisionblocks : function(){
		let hit = false;
		let block = null;
		let cblocks = [];
		if(this.velocity.y < 0){
			for(let i = levelspawner.collidableblocks.length-1; i >=0; i--){
				let iblock = levelspawner.collidableblocks[i];
				if(Rect.testCollision(iblock.rect, this.rect)){
					hit = true;
					block = iblock;
					break;
				}
			}
		}
		else{
			for(let i = 0; i < levelspawner.collidableblocks.length; i++){
				let iblock = levelspawner.collidableblocks[i];
				if(Rect.testCollision(iblock.rect, this.rect)){
					hit = true;
					block = iblock;
					break;
				}
			}
		}
		if(hit){
			let mycenter = this.lastpos.add(new Vector2(this.rect.w/2,this.rect.h/2));
			let blockcenter = block.rect.pos.add(new Vector2(block.rect.w/2, block.rect.h/2));
			let blockcenter2mycenter = mycenter.subtract(blockcenter);
			let m2t = new Vector2(block.rect.pos.x + block.rect.w/2, block.rect.pos.y).subtract(new Vector2(block.rect.pos.x + block.rect.w/2, block.rect.pos.y + block.rect.h/2)); 
			if(!block.gold){
				block.health--;
				if(block.health <= 0){
					block.delete();
					levelspawner.initcollidableblocks();
				}
			}
			let angle = m2t.getUnsignedAngle(blockcenter2mycenter);
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
		this.rect.pos.y = paddle.rect.pos.y - this.rect.w -1;
	}
}
