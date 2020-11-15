var ballcontroller = {
	balls : [],
	img : null,
	mainball : null,
	spreadangle : 40,
	loadimage : function(){
		var ballimg = new Image();
		ballimg.onload = function(){
			ballcontroller.img = this;
			loadscreen.registerloadedfile();
		}
		ballimg.src = ballURL;
	},
	addball : function(speed, direction, pos, sticktobat){
		let newball = Object.create(ball);
		newball.init(speed, direction, pos, sticktobat);
		this.balls.push(newball);
		if(this.mainball == null){
			this.mainball = newball;
		}
	},
	addballs : function(number){
		let mainballdirection = this.mainball.velocity.getNormal();
		let LorR = true;
		let LorRCounter = 0;
		let rotateddirection;
		let currentangle = this.spreadangle/2;
		for(let i=0; i<number; i++){
			let fraction = i/number;
			if(LorR){
				LorR = false;
				LorRCounter++;
				dir = mainballdirection.rotate(currentangle * (Math.PI/180));
				ballcontroller.addball(
							this.mainball.speed, // speed
							dir, //direction
							this.mainball.rect.pos,// position
							false // is stuck to bat
						);
			}
			else{
				LorR = true;
				LorRCounter++;
				dir = mainballdirection.rotate(-(currentangle * (Math.PI/180)));
				ballcontroller.addball(
							this.mainball.speed, // speed
							dir, //direction
							this.mainball.rect.pos,// position
							false // is stuck to bat
						);
			}
			if(LorRCounter == 2){
				LorRCounter = 0;
				currentangle -= (this.spreadangle / 2)/ number;
			}
			
		} 
	},
	clearballs : function(){
		while(this.balls.length){
			this.balls[0].delete();
		}
	},
	unpauseall : function(){
		for(let i = 0; i<this.balls.length; i++){
			this.balls[i].unpause();
		}
	}
}
var ball = {
	scene : scene.scenes.playing,
	drawlayer : 0,
	scalefactor : 1.5 * (canvas.width/330),
	img : null,
	rect : null ,
	speed : canvas.width,
	velocity : null,
	maxrot : 25,
	lastpos : null,
	speedincrease : 10,// * c.width/330,
	maxspeed : null,
	stucktobat : true,
	willsticktobat : false,
	bat2me : null,
	last : null,
	loadimage : function(){
		var ballimg = new Image();
		ballimg.onload = function(){
			ball.img = this;
			loadscreen.registerloadedfile();
		}
		ballimg.src = ballURL;
	},
	unpause : function(){
		this.last = d.getTime();
	},
	init : function(speed, direction, pos, sticktobat){
		this.maxspeed = canvas.width + (this.speedincrease*20);
		this.speed = speed;//canvas.width;
		//this.maxspeed = canvas.width + (this.speedincrease*15); //putting this line here does not work for some reason on mobile but does on pc... sets maxpeed to Nan - see main file for new location of this line
		this.scalefactor = levelspawner.blockw/16;//1.5 * (canvas.width/330);
		this.velocity = direction.multiplyByScalar(this.speed); //new Vector2(0,-1).multiplyByScalar(this.speed);

		let position = pos;//new Vector2(paddle.rect.pos.x + paddle.rect.w/2, paddle.rect.pos.y - (4*ball.scalefactor) - 1);
		this.rect = new Rect(position, 5* this.scalefactor, 4* this.scalefactor);
		if(sticktobat){
			this.sticktobat();
		}
		else{
			this.stucktobat = false;
		}
		this.img = ballcontroller.img;
		this.scene.drawlist[this.drawlayer].push(this);
		this.scene.updatelist.push(this);
		this.drawlayer = 3;
		this.last = d;
	},
	draw : function(){
		ctx.drawImage(this.img, this.rect.pos.x, this.rect.pos.y, this.img.width * this.scalefactor, this.img.height * this.scalefactor);
	},
	resetspeed: function(){
		this.speed = canvas.width;
		this.velocity = new Vector2(0,-1).multiplyByScalar(this.speed);
	},
	sticktobat: function(){		
		//this.rect.pos = new Vector2(paddle.rect.pos.x + paddle.rect.w/2, paddle.rect.pos.y - (4*ball.scalefactor) - 1);
		this.bat2me = this.rect.pos.subtract(paddle.rect.pos);
		this.stucktobat = true;
	},
	update : function(){
		let time = d.getTime();
		let deltatime = (time - this.last)/1000;

		this.last = time;
		if(!this.stucktobat){
			this.lastpos = this.rect.pos;
			this.rect.pos = this.rect.pos.add(this.velocity.multiplyByScalar(deltatime));
			if(this.rect.pos.y > canvas.height && paddle.state != paddle.transitions.dead && paddle.state != paddle.transitions.init){
				this.delete();
				if(ballcontroller.balls.length <= 0){
					audio.play(audio.sounds["die"]);
					paddle.state.transition2dead();
				}
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
				if(this.willsticktobat){
					this.sticktobat();
					audio.play(audio.sounds["sticktobat"]);
				}
				else{
					audio.play(audio.sounds["bathit"]);
				}
			}
			let bouncetype = this.testcollisionblocks();
			if(bouncetype != null){
				
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
	getearlierhits : function(hitblock){
		let start = this.lastpos;
		let end = this.rect.pos;
		let lerps = 6;
		let hits = [];
		let collidable = [...hitblock.neighbours];

		collidable.push(hitblock);
		for(let i=1; i<=lerps; i++){
			let t = i/lerps;
			let pos = start.Lerp(end,t);
			let rect = new Rect(pos,this.rect.w, this.rect.h);
			for(let j=0; j<collidable.length; j++){
				let irect = collidable[j].rect;
				if(Rect.testCollision(rect, irect)){
					hits.push(collidable[j]);
				}
			}
			if(hits.length > 0){
				this.rect.pos = pos;
				return hits;
			}

		}
		//return [];
	},
	testcollisionblocks : function(){
		let hit = false;
		let block = null;
		
		let hits = [];
		for(let i = 0; i < levelspawner.collidableblocks.length; i++){
			let iblock = levelspawner.collidableblocks[i];
			if(Rect.testCollision(iblock.rect, this.rect)){
				//hits.push(iblock);
				hits = this.getearlierhits(iblock);
				//break;
			}
		}
		switch(hits.length){
			case 0:
				return null;
				break;
			case 1:

				block = hits[0];
				break;
			case 2:
				if(hits[0].gridcoords.x == hits[1].gridcoords.x + 1 || //two horizontally adjacent blocks hit
				   hits[0].gridcoords.x == hits[1].gridcoords.x - 1){
				   	hits[0].decrementHealth();
				   	hits[1].decrementHealth();
				   	//this.rect.pos = this.lastpos;
					return "horizontal";
				}
				else if(hits[0].gridcoords.y == hits[1].gridcoords.y + 1 || //two vertically adjacent blocks hit
				   		hits[0].gridcoords.y == hits[1].gridcoords.y - 1){
					hits[0].decrementHealth();
				   	hits[1].decrementHealth();
				   	//this.rect.pos = this.lastpos;
					return "vertical";
				}
				else{
					console.error("two blocks hit, non adjacent");
					return null;
				}
				break;
			case 3:
				block = hits[0];
				break;
			default:
				console.error("more than three blocks hit");
				return null;
		}
		//if(hit){
		let mycenter = this.lastpos.add(new Vector2(this.rect.w/2,this.rect.h/2));
		let blockcenter = block.rect.pos.add(new Vector2(block.rect.w/2, block.rect.h/2));
		let blockcenter2mycenter = mycenter.subtract(blockcenter);
		let m2t = new Vector2(block.rect.pos.x + block.rect.w/2, block.rect.pos.y).subtract(new Vector2(block.rect.pos.x + block.rect.w/2, block.rect.pos.y + block.rect.h/2)); 

		//block.decrementHealth();
		
		let angle = m2t.getUnsignedAngle(blockcenter2mycenter);
		if (angle > levelspawner.toprightangle && angle < levelspawner.bottomrightangle){
			block.decrementHealth();

			//this.rect.pos.x = this.lastpos.x;
			return "vertical";

		}
		else if(angle == levelspawner.toprightangle || angle == levelspawner.bottomrightangle){
			return 'corner';
		}
		else {

			//this.rect.pos.y = this.lastpos.y;
			block.decrementHealth();
			return "horizontal";
		}
		//}
		//return null;
	},
	bounce : function(surface){
		this.speed += this.speedincrease;
		if(this.speed > this.maxspeed){
			this.speed = this.maxspeed;
		}
		this.velocity = (this.velocity.getNormal()).multiplyByScalar(this.speed);

		switch(surface){
			case "horizontal":
				this.velocity.y *= -1;
				break;
			case "vertical":	
				this.velocity.x *= -1;
				break;
			case "corner":

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
		//this.rect.pos = this.lastpos;
	},
	delete : function(){
		for(let i = 0; i<this.scene.drawlist[this.drawlayer].length; i++){
			if(this.scene.drawlist[this.drawlayer][i] == this){
				this.scene.drawlist[this.drawlayer].splice(i, 1);
			}
		}
		for(let i = 0; i<this.scene.updatelist.length; i++){
			if(this.scene.updatelist[i] == this){
				this.scene.updatelist.splice(i, 1);
			}
		}
		for(let i = 0; i<ballcontroller.balls.length; i++){
			if(ballcontroller.balls[i] == this){
				ballcontroller.balls.splice(i, 1);
			}
		}
		if(ballcontroller.mainball == this){
			if(ballcontroller.balls.length > 0){
				ballcontroller.mainball = ballcontroller.balls[0];
			}
			else{
				ballcontroller.mainball = null;
			}
		}
	}
}
