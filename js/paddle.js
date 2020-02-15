var paddle = {
	states:{
		init: {
			update: function(){

			},
			transition2normal : function(){

			}
		},
		normal : { 
			update: function(){

			},
			transition2dead : function(){

			}
		},
		dead : { 
			update: function(){

			},
			transition2init : function(){

			}
		}
	},
	flashspeed : 150, // number of milliseconds between animation frames
	scalefactor: 2,
	animationtimer : d.getTime(),
	animationsobj : {startup : {frames:[], offset: null}, normalsize : {frames:[], offset: null}},
	currentanimation : null,
	img : null,
	appeartime : 500,
	currentframespritesheetrect : null,
	rect : new Rect(new Vector2(canvas.width/2,canvas.height - 20), 0,0),
	spritecoords : {
		x : 0,
		y : 0
	},
	/*
	let sheight = 16;
		let swidth = 32;
		let subgridorigin = new Vector2(0,0);
		let numcolumns = 4;
		let numrows = 4;
	*/
	initanimations : function(){
		let sheight = 16;
		let swidth = 32;
		let subgridorigin = new Vector2(0,0);
		let numcolumns = 4;
		let numrows = 4;
		this.animationsobj.startup.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.startup.offset = new Vector2(0,4);
		sheight = 8;
		swidth = 32;
		subgridorigin = new Vector2(0,64);
		numcolumns = 4;
		numrows = 4;
		this.animationsobj.normalsize.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.normalsize.offset = new Vector2(0,0);
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
		/*
		var swidth = this.img.width / 15;
		var sheight = this.img.height / 28;
		var sx = this.spritecoords.x * swidth;
		var sy = this.spritecoords.y * sheight;
		ctx.drawImage(this.img, sx, sy, swidth, sheight, this.rect.pos.x, this.rect.pos.y, this.rect.w, this.rect.h);
		*/
		let srect = this.currentframespritesheetrect;
		ctx.drawImage(this.img, srect.pos.x, srect.pos.y, srect.w, srect.h, this.rect.pos.x + this.currentanimation.offset.x , this.rect.pos.y + this.currentanimation.offset.y, this.rect.w, this.rect.h);

	},
	loadimage : function(){
		var normalpaddleimg = new Image();
		normalpaddleimg.onload = function(){
			paddle.img = this;
			paddle.rect.w = (this.width/15) * paddle.scalefactor;
			paddle.rect.h = (this.height/28)* paddle.scalefactor;
			paddle.initanimations();
			paddle.currentanimation = paddle.animationsobj.normalsize;
			console.log("current anim");
			console.log(paddle.currentanimation);
			drawlist[1].push(paddle);
			updatelist.push(paddle);

		}
		normalpaddleimg.src = normalpaddleURL;
	},
	update(){
		
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
		this.currentframespritesheetrect = this.currentanimation.frames[index]; 
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