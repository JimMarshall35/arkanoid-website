var paddle = {
	drawlayer : 2,
	transitions : {
		init : {
			materializetime : 500,
			animationtimer : d.getTime(),
			update: function(){
				let time = d.getTime() - this.animationtimer;
				if(time >= this.materializetime){
					this.transition2normal();
					return;
				}
				let index = Math.round((time/this.materializetime)*(paddle.currentanimation.frames.length-1));
				paddle.currentframespritesheetrect = paddle.currentanimation.frames[index];
			},
			transition2normal : function(){
				paddle.currentanimation = paddle.animationsobj.normalsize;
				paddle.state = paddle.transitions.normal;
				this.delete();
				updatelist.push(paddle.transitions.normal);
			},
			delete : function(){
				for(let i=0; i < updatelist.length; i++){
					if(updatelist[i] === this){
						updatelist.splice(i,1);
					}
				}
			}
		},
		normal : { 
			flashspeed : 150, // number of milliseconds between animation frames
			
			spritecoords : {
				x : 0,
				y : 0
			},
			update: function(){
				let time = d.getTime() - this.animationtimer;
				if(time >= this.flashspeed){
					this.spritecoords.y++;
					this.animationtimer = d.getTime();
					if(this.spritecoords.y > 3){
						this.spritecoords.y = 0;
						this.spritecoords.x++;
						if(this.spritecoords.x > 3){
							this.spritecoords.x = 0;
						}
					}
				}
				let index = this.spritecoords.x + 4*this.spritecoords.y;
				paddle.currentframespritesheetrect = paddle.currentanimation.frames[index]; 
			},
			transition2dead : function(){
				//ball.rect.pos = new Vector2(paddle.rect.pos.x + paddle.rect.w/2, paddle.rect.pos.y - (4*ball.scalefactor) - 1);
				powerupcontroller.deleteAll();
				powerupcontroller.resetPowerups();
				paddle.currentanimation = paddle.animationsobj.die;
				paddle.state = paddle.transitions.dead;
				this.delete();
				updatelist.push(paddle.transitions.dead);
				paddle.state.animationtimer = d.getTime();
			},
			transition2long: function(){

			},
			transition2laser : function(){
				paddle.currentanimation = paddle.animationsobj.golaser;

				//paddle.currentframespritesheetrect = paddle.currentanimation.frames[this.lasertransitionindex]; 
				paddle.state = paddle.transitions.morphingtolaser;
				this.delete();
				updatelist.push(paddle.transitions.morphingtolaser);
				paddle.state.animationtimer = d.getTime();
			},
			delete : function(){
				for(let i=0; i < updatelist.length; i++){
					if(updatelist[i] === this){
						updatelist.splice(i,1);
					}
				}
			}
		},
		morphingtolaser : {
			turn2laserspeed : 50,
			animationtimer : d.getTime(),
			lasertransitionindex : 0,
			update: function(){
				let time = d.getTime() - this.animationtimer;
				if(time >= this.turn2laserspeed){
					this.animationtimer = d.getTime();
					this.lasertransitionindex++;
					//console.log(this.lasertransitionindex);
					if(this.lasertransitionindex > paddle.animationsobj.golaser.frames.length - 1){
						paddle.state = paddle.transitions.laser;
						paddle.currentanimation = paddle.animationsobj.laser;
						paddle.currentframespritesheetrect = paddle.animationsobj.laser.frames[0];
						updatelist.push(paddle.transitions.laser);
						this.delete();				
						this.lasertransitionindex = 0;
					}
				}
				paddle.currentframespritesheetrect = paddle.currentanimation.frames[this.lasertransitionindex]; 
			},
			delete : function(){
				for(let i=0; i < updatelist.length; i++){
					if(updatelist[i] === this){
						updatelist.splice(i,1);
					}
				}
			},
			transition2dead : function(){
				//ball.rect.pos = new Vector2(paddle.rect.pos.x + paddle.rect.w/2, paddle.rect.pos.y - (4*ball.scalefactor) - 1);
				powerupcontroller.deleteAll();
				powerupcontroller.resetPowerups();
				paddle.currentanimation = paddle.animationsobj.die;
				paddle.state = paddle.transitions.dead;
				this.delete();
				updatelist.push(paddle.transitions.dead);
				paddle.state.animationtimer = d.getTime();
			}
		},
		morphingfromlaser: {
			turn2laserspeed : 50,
			animationtimer : d.getTime(),
			lasertransitionindex : 14,
			update: function(){
				let time = d.getTime() - this.animationtimer;
				if(time >= this.turn2laserspeed){
					this.animationtimer = d.getTime();
					this.lasertransitionindex--;
					console.log(this.lasertransitionindex);
					if(this.lasertransitionindex < 0){
						paddle.state = paddle.transitions.normal;
						paddle.currentanimation = paddle.animationsobj.normalsize;
						paddle.currentframespritesheetrect = paddle.animationsobj.normalsize.frames[0];
						updatelist.push(paddle.transitions.normal);
						this.delete();		
						this.lasertransitionindex = 14;
					}
				}
				paddle.currentframespritesheetrect = paddle.currentanimation.frames[this.lasertransitionindex]; 
			},
			delete : function(){
				for(let i=0; i < updatelist.length; i++){
					if(updatelist[i] === this){
						updatelist.splice(i,1);
					}
				}
			},
			transition2dead : function(){
				//ball.rect.pos = new Vector2(paddle.rect.pos.x + paddle.rect.w/2, paddle.rect.pos.y - (4*ball.scalefactor) - 1);
				powerupcontroller.deleteAll();
				powerupcontroller.resetPowerups();
				paddle.currentanimation = paddle.animationsobj.die;
				paddle.state = paddle.transitions.dead;
				this.delete();
				updatelist.push(paddle.transitions.dead);
				paddle.state.animationtimer = d.getTime();
			}
		},
		long : {

		},
		laser : {
			animationtimer : d.getTime(),
			animationtime : 150,
			index : 0,
			update : function(){
				let time = d.getTime() - this.animationtimer;
				paddle.currentframespritesheetrect = paddle.currentanimation.frames[this.index];
				if(time >= this.animationtime){
					this.animationtimer = d.getTime();
					this.index++;
					if(this.index > paddle.animationsobj.laser.frames.length - 1){
						this.index = 0;
					}
				}
				for(let i=0; i<paddle.projectiles.length; i++){
					paddle.projectiles[i].update();
				}
			},
			delete : function(){
				for(let i=0; i < updatelist.length; i++){
					if(updatelist[i] === this){
						updatelist.splice(i,1);
					}
				}
			},
			transitionfromlaser : function(){
				paddle.currentanimation = paddle.animationsobj.golaser;

				//paddle.currentframespritesheetrect = paddle.currentanimation.frames[this.lasertransitionindex]; 
				paddle.state = paddle.transitions.morphingfromlaser;
				this.delete();
				updatelist.push(paddle.transitions.morphingfromlaser);
				paddle.state.animationtimer = d.getTime();
			},
			transition2dead : function(){
				//ball.rect.pos = new Vector2(paddle.rect.pos.x + paddle.rect.w/2, paddle.rect.pos.y - (4*ball.scalefactor) - 1);
				powerupcontroller.deleteAll();
				powerupcontroller.resetPowerups();
				paddle.currentanimation = paddle.animationsobj.die;
				paddle.state = paddle.transitions.dead;
				this.delete();
				updatelist.push(paddle.transitions.dead);
				paddle.state.animationtimer = d.getTime();
			}
		},
		dead : { 
			explodespeed : 500,
			animationtimer : d.getTime(),
			respawnready : false,
			update: function(){
				if(this.respawnready){
					this.transition2init();
				}
				let time = d.getTime() - this.animationtimer;
				if(time > this.explodespeed){
					return;
				}
				let index = Math.round((time/this.explodespeed)*(paddle.currentanimation.frames.length-1));
				paddle.currentframespritesheetrect = paddle.currentanimation.frames[index]; 
			},
			transition2init : function(){
				paddle.currentanimation = paddle.animationsobj.startup;
				paddle.state = paddle.transitions.init;
				this.respawnready = false;
				ball.resetspeed();
				this.delete();
				ball.rect.pos = new Vector2(paddle.rect.pos.x + paddle.rect.w/2, paddle.rect.pos.y - (4*ball.scalefactor) - 1);
				ball.sticktobat();
				gamecontroller.decrementlives();
				updatelist.push(paddle.transitions.init);
				paddle.state.animationtimer = d.getTime();
			},
			delete : function(){
				for(let i=0; i < updatelist.length; i++){
					if(updatelist[i] === this){
						updatelist.splice(i,1);
					}
				}
			}
		}
	},
	state : null,	
	projectiles : [],
	scalefactor: 1.5 * (c.width/330),	
	animationsobj : {
		// frames is an array of rects each one the coordinates on the sprite sheet of an animation frame
		// offset is added to the paddles coordinates to draw sprites that differ in size to the normal bat

		//single sprites
		laserprojectile : new Rect(new Vector2(48,144), 16, 8),
		lifemarker : new Rect(new Vector2(32,152), 16, 8),
		powerupflashS : new Rect(new Vector2(192,96), 24, 8),
		powerupflashM : new Rect(new Vector2(192,104), 32, 8),
		powerupflashL : new Rect(new Vector2(192,112), 48, 8),

		//animations
		startup : {frames : [], offset : null}, // bat materialises
		normalsize : {frames : [], offset : null}, // idle animation for when the bat is normal size - 32x8px sprites
		die : {frames : [], offset : null},  // explode animation - double height sprites on sheet - 16px
		golong : {frames : [], offset : null}, // transition to long bat
		golaser : {frames : [], offset : null},  // transition to laser
		long : {frames : [], offset : null}, // long bat idle  - sprites 48 px width
		laser : {frames : [], offset : null}, // laser idle
		short : {frames : [], offset : null} // short bat idle - sprites 24px width
	},
	currentanimation : null,
	img : null,
	currentframespritesheetrect : null,
	rect : new Rect(new Vector2(canvas.width/2,canvas.height - (20*c.width/330)), 0,0),
	initanimations : function(){
		//startup
		let sheight = 16;
		let swidth = 32;
		let subgridorigin = new Vector2(0,0);
		let numcolumns = 4;
		let numrows = 4;
		this.animationsobj.startup.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.startup.offset = new Rect(new Vector2(0,-4),1,2);

		//normal
		sheight = 8;
		swidth = 32;
		subgridorigin = new Vector2(0,64);
		numcolumns = 4;
		numrows = 4;
		this.animationsobj.normalsize.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.normalsize.offset = new Rect(new Vector2(0,0),1,1);

		//die
		sheight = 16;
		swidth = 32;
		subgridorigin = new Vector2(0,208);
		numcolumns = 5;
		numrows = 1;
		this.animationsobj.die.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.die.offset = new Rect(new Vector2(0,-4),1,2);

		//laser transition
		sheight = 8;
		swidth = 32;
		subgridorigin = new Vector2(0,136);
		numcolumns = 15;
		numrows = 1;
		this.animationsobj.golaser.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.golaser.offset = new Rect(new Vector2(0,0),1,1);

		//laser idle
		sheight = 8;
		swidth = 32;
		subgridorigin = new Vector2(0,144);
		numcolumns = 1;
		numrows = 4;
		this.animationsobj.laser.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.laser.offset = new Rect(new Vector2(0,0),1,1);

		//short idle
		sheight = 8;
		swidth = 24;
		subgridorigin = new Vector2(128,64);
		numcolumns = 1;
		numrows = 4;
		this.animationsobj.short.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.short.offset = new Rect(new Vector2(4,0),1,1);

		//long idle
		sheight = 8;
		swidth = 48;
		subgridorigin = new Vector2(0,104);
		numcolumns = 4;
		numrows = 4;
		this.animationsobj.long.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.long.offset = new Rect(new Vector2(4,0),1,1);
		console.log(this.animationsobj);
	},
	loadanimation : function(sheight,swidth,subgridorigin,numcolumns,numrows){
		let arr = [];
		for(let i=0; i<numrows; i++){
			for(let j=0; j<numcolumns; j++){
				arr.push(new Rect(new Vector2(subgridorigin.x + j*swidth, subgridorigin.y + i*sheight),swidth,sheight));
			}
		}
		return arr;
	},
	draw : function(){
		let srect = this.currentframespritesheetrect;
		if(srect != null){
			ctx.drawImage(this.img, srect.pos.x, srect.pos.y, srect.w, srect.h, this.rect.pos.x + this.currentanimation.offset.pos.x , this.rect.pos.y + this.currentanimation.offset.pos.y, this.rect.w*this.currentanimation.offset.w, this.rect.h*this.currentanimation.offset.h);
		}
		for(let i=0; i<this.projectiles.length; i++){
			this.projectiles[i].draw();
		}
		
	},
	loadimage : function(){
		var normalpaddleimg = new Image();
		normalpaddleimg.onload = function(){
			loadscreen.registerloadedfile();
			paddle.init(this);
		}
		normalpaddleimg.src = normalpaddleURL;
	},
	init : function(img){
		scalefactor = 1.5 * (c.width/330);
		this.img = img;
		this.rect.w = (img.width/15) * this.scalefactor;
		this.rect.h = (img.height/28) * this.scalefactor;
		this.initanimations();
		this.currentanimation = this.animationsobj.startup;
		this.state = this.transitions.init;
		drawlist[this.drawlayer].push(this);
		updatelist.push(this.state);
	},
	move(deltaX){
		this.rect.pos.x += deltaX;
		if(this.rect.pos.x < 0){
			this.rect.pos.x = 0;
		}
		else if(this.rect.pos.x > canvas.width - this.rect.w){
			this.rect.pos.x = canvas.width - this.rect.w;
		}
	},
	shoot : function(){
		let w = (this.img.width/30) * this.scalefactor;
		let h = (this.img.height/28) * this.scalefactor;
		console.log(w,h);
		console.log(this.rect.w,this.rect.h);
		let p = new Projectile(this.img, this.animationsobj.laserprojectile,w,h);
		console.log("fire");
		console.log(this.animationsobj.laserprojectile);
		this.projectiles.push(p);
		updatelist.push(p);
		//drawlist[this.drawlayer].push(p);
	}
}
class Projectile{
	constructor(image, srect, w, h){
		this.img = image;
		this.srect = srect;
		this.rect = new Rect(new Vector2(paddle.rect.pos.x + (paddle.rect.w/2 - w/2), paddle.rect.pos.y - h), w, h);
		this.speed = canvas.width*2;
		this.last = d.getTime();
		this.velocity = new Vector2(0,-1).multiplyByScalar(this.speed);
		this.drawlayer = 1;
		
		
	}
	update(){
		let time = d.getTime();
		let deltatime = (time - this.last)/1000;
		this.last = time;
		this.rect.pos = this.rect.pos.add(this.velocity.multiplyByScalar(deltatime));
		for(let i=0; i<levelspawner.collidableblocks.length; i++){
			if(Rect.testCollision(this.rect,levelspawner.collidableblocks[i].rect)){
				this.delete();
				if(!levelspawner.collidableblocks[i].gold){
					levelspawner.collidableblocks[i].decrementHealth();
					
				}

			}
		}
		if(this.rect.pos.y + this.rect.h < 0){
			this.delete();
		}
	}
	delete(){
		for(let i=0; i<paddle.projectiles.length; i++){
			if(paddle.projectiles[i] == this){
				paddle.projectiles.splice(i,1);
			}
		}
		for(let i=0; i<updatelist.length; i++){
			if(updatelist[i] == this){
				updatelist.splice(i,1);
			}
		}
	}
	draw(){
		console.log("draw");
		console.log(this.srect);
		ctx.drawImage(this.img, this.srect.pos.x, this.srect.pos.y, this.srect.w, this.srect.h, this.rect.pos.x, this.rect.pos.y, this.rect.w, this.rect.h);
	}
}
