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
			animationtimer : d.getTime(),
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
				paddle.currentanimation = paddle.animationsobj.die;
				paddle.state = paddle.transitions.dead;
				this.delete();
				updatelist.push(paddle.transitions.dead);
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
		dead : { 
			explodespeed : 500,
			animationtimer : d.getTime(),
			respawnready : false,
			update: function(){
				if(this.respawnready){
					this.transition2init();
					//gamecontroller.decrementlives();
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
				this.delete();
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
	
	scalefactor: 1.5 * (c.width/330),
	
	animationsobj : {startup : {frames:[], offset: null}, normalsize : {frames:[], offset: null}, die : {frames:[], offset: null}},
	currentanimation : null,
	img : null,
	currentframespritesheetrect : null,
	rect : new Rect(new Vector2(canvas.width/2,canvas.height - (20*c.width/330)), 0,0),
	

	initanimations : function(){
		let sheight = 16;
		let swidth = 32;
		let subgridorigin = new Vector2(0,0);
		let numcolumns = 4;
		let numrows = 4;
		this.animationsobj.startup.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.startup.offset = new Rect(new Vector2(0,-4),1,2);
		sheight = 8;
		swidth = 32;
		subgridorigin = new Vector2(0,64);
		numcolumns = 4;
		numrows = 4;
		this.animationsobj.normalsize.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.normalsize.offset = new Rect(new Vector2(0,0),1,1);
		sheight = 16;
		swidth = 32;
		subgridorigin = new Vector2(0,208);
		numcolumns = 5;
		numrows = 1;
		this.animationsobj.die.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.die.offset = new Rect(new Vector2(0,-4),1,2);
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
		ctx.drawImage(this.img, srect.pos.x, srect.pos.y, srect.w, srect.h, this.rect.pos.x + this.currentanimation.offset.pos.x , this.rect.pos.y + this.currentanimation.offset.pos.y, this.rect.w*this.currentanimation.offset.w, this.rect.h*this.currentanimation.offset.h);

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
		this.img = img;
		this.rect.w = (img.width/15) * this.scalefactor;
		this.rect.h = (img.height/28)* this.scalefactor;
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
	}
}
