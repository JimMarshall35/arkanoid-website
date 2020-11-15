var paddle = {
	scene : scene.scenes.playing,
	drawlayer : 3,
	state : null,	
	projectiles : [],
	scalefactor: 1.5 * (canvas.width/330),	
	currentanimation : null,
	img : null,
	currentframespritesheetrect : null,
	rect : new Rect(new Vector2(canvas.width/2,canvas.height - (40*canvas.width/330)), 0,0),
	typeenum : null,
	animationsobj : {
		// frames is an array of rects each one the coordinates on the sprite sheet of an animation frame
		// offset is added to the paddles coordinates to draw sprites that differ in size to the normal bat

		//single sprites
		laserprojectile : new Rect(new Vector2(48,144), 16, 8),
		lifemarker : new Rect(new Vector2(32,152), 16, 8),
		powerupflashS : new Rect(new Vector2(192,96), 24, 8),
		powerupflashM : new Rect(new Vector2(192,104), 32, 8),
		powerupflashL : new Rect(new Vector2(192,112), 48, 8),
		expandendleft : new Rect(new Vector2(144,96),24,8),
		expandendright : new Rect(new Vector2(168,96),24,8),
		normalshadow : new Rect(new Vector2(32,168), 32, 8),
		lasershadow : new Rect(new Vector2(64,168), 32, 8),
		longshadow : new Rect(new Vector2(192,128), 48, 8),
		leftendshadow : new Rect(new Vector2(240,128),24,8),
		rightendshadow : new Rect(new Vector2(264,128),24,8),
		//animations - loaded in initanimations method 
		startup : {frames : [], offset : null}, // bat materialises
		normalsize : {frames : [], offset : null}, // idle animation for when the bat is normal size - 32x8px sprites
		die : {frames : [], offset : null},  // explode animation - double height sprites on sheet - 16px
		golong : {frames : [], offset : null}, // transition to long bat
		golaser : {frames : [], offset : null},  // transition to laser
		long : {frames : [], offset : null}, // long bat idle  - sprites 48 px width
		laser : {frames : [], offset : null}, // laser idle
		short : {frames : [], offset : null} // short bat idle - sprites 24px width
	},
	
	transitions : {
		init : {
			istransition : true,
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
				paddle.scene.updatelist.push(paddle.transitions.normal);
			},
			delete : function(){
				for(let i=0; i < paddle.scene.updatelist.length; i++){
					if(paddle.scene.updatelist[i] === this){
						paddle.scene.updatelist.splice(i,1);
					}
				}
			}
		},
		normal : { 
			flashspeed : 150, // number of milliseconds between animation frames
			istransition : false,
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
				powerupcontroller.deleteAll();
				powerupcontroller.resetPowerups(()=>{});
				paddle.currentanimation = paddle.animationsobj.die;
				paddle.state = paddle.transitions.dead;
				this.delete();
				paddle.scene.updatelist.push(paddle.transitions.dead);
				paddle.state.animationtimer = d.getTime();
			},
			transition2long: function(){
				audio.play(audio.sounds["grow"]);
				paddle.currentanimation = paddle.animationsobj.golong;
				paddle.state = paddle.transitions.morphingtolong;
				this.delete();
				paddle.scene.updatelist.push(paddle.transitions.morphingtolong);
				paddle.state.animationtimer = d.getTime();
				paddle.state.init();
			},
			transition2laser : function(){
				audio.play(audio.sounds["grow"]);
				paddle.currentanimation = paddle.animationsobj.golaser;
				//paddle.currentframespritesheetrect = paddle.currentanimation.frames[this.lasertransitionindex]; 
				paddle.state = paddle.transitions.morphingtolaser;
				this.delete();
				paddle.scene.updatelist.push(paddle.transitions.morphingtolaser);
				paddle.state.animationtimer = d.getTime();
			},
			delete : function(){
				for(let i=0; i < paddle.scene.updatelist.length; i++){
					if(paddle.scene.updatelist[i] === this){
						paddle.scene.updatelist.splice(i,1);
					}
				}
			}
		},

		morphingtolong :{
			istransition : true,
			finalwidth : null,
			endlengthdims : null,
			leftrect : null,
			rightrect : null,
			transitiontime : 300,
			animationtransitiontime : 150,
			animationtimer : d.getTime(),
			expandendtime : null,
			onlyonce : true,
			init : function(){
				this.onlyonce = true;
				this.finalwidth =paddle.rect.w *1.5;
				this.endlengthdims = {w:paddle.animationsobj.expandendleft.w * paddle.scalefactor, h:paddle.animationsobj.expandendleft.h * paddle.scalefactor};
			},
			update : function(){
				let time = d.getTime() - this.animationtimer;
				let t = time/this.transitiontime;
				if(t < 1){
					let lstartpos = paddle.rect.pos;
					let rstartpos = new Vector2((paddle.rect.pos.x + paddle.rect.w) - this.endlengthdims.w, paddle.rect.pos.y);
					let lendpos = new Vector2(lstartpos.x - paddle.rect.w*0.25, lstartpos.y);
					let rendpos = new Vector2(lstartpos.x  + paddle.rect.w*0.25, lstartpos.y);
					this.rightrect = new Rect(rstartpos.Lerp(rendpos, t), this.endlengthdims.w, this.endlengthdims.h);
					this.leftrect = new Rect(lstartpos.Lerp(lendpos, t), this.endlengthdims.w, this.endlengthdims.h);
				}
				else{
					if(this.onlyonce){
						this.expandendtime = d.getTime();
						paddle.rect.pos.x -= paddle.rect.w *0.25;
						paddle.rect.w = this.finalwidth;
						this.leftrect = null;
						this.rightrect = null;
						this.onlyonce = false;
					}
					time = d.getTime() - this.expandendtime;
					t = time / this.animationtransitiontime;
					let index = Math.floor(t*paddle.currentanimation.frames.length);
					paddle.currentframespritesheetrect=paddle.currentanimation.frames[index];
					if(time > this.animationtransitiontime){
						paddle.state = paddle.transitions.long;
						paddle.currentanimation = paddle.animationsobj.long;
						paddle.currentframespritesheetrect = paddle.animationsobj.long.frames[0];
						paddle.scene.updatelist.push(paddle.transitions.long);

						this.delete();
					}
				}
				

			},
			transition2dead : function(){
				powerupcontroller.deleteAll();
				powerupcontroller.resetPowerups(()=>{});
				paddle.currentanimation = paddle.animationsobj.die;
				paddle.state = paddle.transitions.dead;
				this.delete();
				paddle.scene.updatelist.push(paddle.transitions.dead);
				paddle.state.animationtimer = d.getTime();
			},
			draw : function(){
				if(this.leftrect != null && this.rightrect != null){
					ctx.drawImage(paddle.img, paddle.animationsobj.expandendleft.pos.x, paddle.animationsobj.expandendleft.pos.y, paddle.animationsobj.expandendleft.w, paddle.animationsobj.expandendleft.h, this.leftrect.pos.x, this.leftrect.pos.y, this.leftrect.w,this.leftrect.h);
					ctx.drawImage(paddle.img, paddle.animationsobj.expandendright.pos.x, paddle.animationsobj.expandendright.pos.y, paddle.animationsobj.expandendright.w, paddle.animationsobj.expandendright.h, this.rightrect.pos.x, this.rightrect.pos.y, this.rightrect.w,this.rightrect.h);
				}

			},
			delete : function(){
				for(let i=0; i < paddle.scene.updatelist.length; i++){
					if(paddle.scene.updatelist[i] === this){
						paddle.scene.updatelist.splice(i,1);
					}
				}
			},
			drawshadow : function(){
				if(this.rightrect != null && this.leftrect != null){
					ctx.drawImage(paddle.img, paddle.animationsobj.leftendshadow.pos.x,
							paddle.animationsobj.leftendshadow.pos.y,
							paddle.animationsobj.leftendshadow.w,
							paddle.animationsobj.leftendshadow.h,
							this.leftrect.pos.x + (this.leftrect.w/2),
							this.leftrect.pos.y + (this.leftrect.h/2),
							this.leftrect.w,
							this.leftrect.h);
					ctx.drawImage(paddle.img, paddle.animationsobj.rightendshadow.pos.x,
							paddle.animationsobj.rightendshadow.pos.y,
							paddle.animationsobj.rightendshadow.w,
							paddle.animationsobj.rightendshadow.h,
							this.rightrect.pos.x + (this.rightrect.w/2),
							this.rightrect.pos.y + (this.rightrect.h/2),
							this.rightrect.w,
							this.rightrect.h);
				}
				
			}
		},
		morphingfromlong :{
			istransition : true,
			finalwidth : null,
			endlengthdims : null,
			leftrect : null,
			rightrect : null,
			transitiontime : 300,
			animationtransitiontime : 150,
			animationtimer : d.getTime(),
			expandendtime : null,
			onlyonce : true,
			callback : null,
			startwidth : null,
			init : function(){
				this.endlengthdims = {w:paddle.animationsobj.expandendleft.w * paddle.scalefactor, h:paddle.animationsobj.expandendleft.h * paddle.scalefactor};
				this.finalwidth = paddle.rect.w - (paddle.rect.w /3);
				this.startwidth = paddle.rect.w;
				this.onlyonce = true;
			},
			draw : function(){
				if(this.leftrect != null && this.rightrect != null){
					ctx.drawImage(paddle.img, paddle.animationsobj.expandendleft.pos.x, paddle.animationsobj.expandendleft.pos.y, paddle.animationsobj.expandendleft.w, paddle.animationsobj.expandendleft.h, this.leftrect.pos.x, this.leftrect.pos.y, this.leftrect.w,this.leftrect.h);
					ctx.drawImage(paddle.img, paddle.animationsobj.expandendright.pos.x, paddle.animationsobj.expandendright.pos.y, paddle.animationsobj.expandendright.w, paddle.animationsobj.expandendright.h, this.rightrect.pos.x, this.rightrect.pos.y, this.rightrect.w,this.rightrect.h);
				}

			},
			update : function(){
				let time = d.getTime() - this.animationtimer;
				let t = time / this.animationtransitiontime;
				if(t < 1){
					let index = (paddle.currentanimation.frames.length-1) - Math.floor(t*paddle.currentanimation.frames.length);
					paddle.currentframespritesheetrect = paddle.currentanimation.frames[index];
				}
				else{
					if(this.onlyonce){
						this.onlyonce = false;
						this.expandendtime = d.getTime();
						var smallbatpos = new Vector2((paddle.rect.pos.x + (paddle.rect.w /2))-this.finalwidth/2, paddle.rect.pos.y);
						//let h = paddle.rect.h;
						paddle.rect = new Rect(smallbatpos, this.finalwidth, paddle.rect.h);
						paddle.currentframespritesheetrect = paddle.animationsobj.normalsize.frames[0];
					}
					let time = d.getTime() - this.expandendtime;
					let t = time / this.animationtransitiontime;
					let lstartpos = new Vector2((paddle.rect.pos.x + paddle.rect.w/2) - this.startwidth/2, paddle.rect.pos.y);
					let rstartpos = new Vector2(((paddle.rect.pos.x + paddle.rect.w/2) + this.startwidth/2) -this.endlengthdims.w, paddle.rect.pos.y);
					let lendpos = paddle.rect.pos;
					let rendpos = (paddle.rect.pos.x + paddle.rect.w) - this.endlengthdims.w 
					this.rightrect = new Rect(rstartpos.Lerp(rendpos, t), this.endlengthdims.w, this.endlengthdims.h);
					this.leftrect = new Rect(lstartpos.Lerp(lendpos, t), this.endlengthdims.w, this.endlengthdims.h);
					if(time > this.transitiontime){
						paddle.state = paddle.transitions.normal;
						paddle.currentanimation = paddle.animationsobj.normalsize;
						paddle.currentframespritesheetrect = paddle.animationsobj.normalsize.frames[0];
						paddle.scene.updatelist.push(paddle.transitions.normal);
						if(this.callback != null){
							this.callback();
						}
						this.rightrect = null;
						this.leftrect = null;
						this.delete();
					}
				}
				
			},
			transition2dead : function(){
				paddle.rect.w = paddle.normalwidth;
				powerupcontroller.deleteAll();
				powerupcontroller.resetPowerups(()=>{});
				paddle.currentanimation = paddle.animationsobj.die;
				paddle.state = paddle.transitions.dead;
				this.delete();
				paddle.scene.updatelist.push(paddle.transitions.dead);
				paddle.state.animationtimer = d.getTime();
			},
			delete : function(){
				for(let i=0; i < paddle.scene.updatelist.length; i++){
					if(paddle.scene.updatelist[i] === this){
						paddle.scene.updatelist.splice(i,1);
					}
				}
			},
			drawshadow : function(){
				if(this.rightrect != null && this.leftrect != null){
					ctx.drawImage(paddle.img, paddle.animationsobj.leftendshadow.pos.x,
							paddle.animationsobj.leftendshadow.pos.y,
							paddle.animationsobj.leftendshadow.w,
							paddle.animationsobj.leftendshadow.h,
							this.leftrect.pos.x + (this.leftrect.w/2),
							this.leftrect.pos.y + (this.leftrect.h/2),
							this.leftrect.w,
							this.leftrect.h);
					ctx.drawImage(paddle.img, paddle.animationsobj.rightendshadow.pos.x,
							paddle.animationsobj.rightendshadow.pos.y,
							paddle.animationsobj.rightendshadow.w,
							paddle.animationsobj.rightendshadow.h,
							this.rightrect.pos.x + (this.rightrect.w/2),
							this.rightrect.pos.y + (this.rightrect.h/2),
							this.rightrect.w,
							this.rightrect.h);
				}
				
			}
		},
		long : {
			istransition : false,
			animationtimer : d.getTime(),
			spritecoords : {x:0, y:0},
			flashspeed : 150,
			update : function(){
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
			delete : function(){
				for(let i=0; i < paddle.scene.updatelist.length; i++){
					if(paddle.scene.updatelist[i] === this){
						paddle.scene.updatelist.splice(i,1);
					}
				}
			},
			transition2dead : function(){
				paddle.rect.w = paddle.normalwidth;
				paddle.currentanimation = paddle.animationsobj.die;
				paddle.state = paddle.transitions.dead;
				this.delete();
				paddle.scene.updatelist.push(paddle.transitions.dead);
				paddle.state.animationtimer = d.getTime();
				powerupcontroller.deleteAll();
				powerupcontroller.resetPowerups(() => {});
			},
			transition2normal : function(callback){
				paddle.currentanimation = paddle.animationsobj.golong;
				paddle.state = paddle.transitions.morphingfromlong;
				this.delete();
				paddle.state.init();
				paddle.state.callback = callback;
				paddle.scene.updatelist.push(paddle.transitions.morphingfromlong);
				paddle.state.animationtimer = d.getTime();
			}
		},
		morphingtolaser : {
			istransition : true,
			turn2laserspeed : 50,
			animationtimer : d.getTime(),
			lasertransitionindex : 0,
			update: function(){
				let time = d.getTime() - this.animationtimer;
				if(time >= this.turn2laserspeed){
					this.animationtimer = d.getTime();
					this.lasertransitionindex++;
					if(this.lasertransitionindex > paddle.animationsobj.golaser.frames.length - 1){
						paddle.state = paddle.transitions.laser;
						paddle.currentanimation = paddle.animationsobj.laser;
						paddle.currentframespritesheetrect = paddle.animationsobj.laser.frames[0];
						paddle.scene.updatelist.push(paddle.transitions.laser);
						this.delete();				
						this.lasertransitionindex = 0;
					}
				}
				paddle.currentframespritesheetrect = paddle.currentanimation.frames[this.lasertransitionindex]; 
			},
			delete : function(){
				for(let i=0; i < paddle.scene.updatelist.length; i++){
					if(paddle.scene.updatelist[i] === this){
						paddle.scene.updatelist.splice(i,1);
					}
				}
			},
			transition2dead : function(){
				powerupcontroller.deleteAll();
				powerupcontroller.resetPowerups(()=>{});
				paddle.currentanimation = paddle.animationsobj.die;
				paddle.state = paddle.transitions.dead;
				this.delete();
				paddle.scene.updatelist.push(paddle.transitions.dead);
				paddle.state.animationtimer = d.getTime();
			}
		},
		morphingfromlaser: {
			istransition : true,
			turn2laserspeed : 50,
			animationtimer : d.getTime(),
			lasertransitionindex : 14,
			callback : null,
			update: function(){
				let time = d.getTime() - this.animationtimer;
				if(time >= this.turn2laserspeed){
					this.animationtimer = d.getTime();
					this.lasertransitionindex--;
					if(this.lasertransitionindex < 0){
						paddle.state = paddle.transitions.normal;
						paddle.currentanimation = paddle.animationsobj.normalsize;
						paddle.currentframespritesheetrect = paddle.animationsobj.normalsize.frames[0];
						paddle.scene.updatelist.push(paddle.transitions.normal);
						this.delete();		
						this.lasertransitionindex = 14;
						this.callback();
					}
				}
				paddle.currentframespritesheetrect = paddle.currentanimation.frames[this.lasertransitionindex]; 
			},
			delete : function(){
				for(let i=0; i < paddle.scene.updatelist.length; i++){
					if(paddle.scene.updatelist[i] === this){
						paddle.scene.updatelist.splice(i,1);
					}
				}
			},
			transition2dead : function(){
				powerupcontroller.deleteAll();
				powerupcontroller.resetPowerups(() => {});
				paddle.currentanimation = paddle.animationsobj.die;
				paddle.state = paddle.transitions.dead;
				this.delete();
				paddle.scene.updatelist.push(paddle.transitions.dead);
				paddle.state.animationtimer = d.getTime();
			}
		},
		
		laser : {
			istransition : false,
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
			},
			delete : function(){
				for(let i=0; i < paddle.scene.updatelist.length; i++){
					if(paddle.scene.updatelist[i] === this){
						paddle.scene.updatelist.splice(i,1);
					}
				}
			},
			transition2normal : function(callback){
				paddle.currentanimation = paddle.animationsobj.golaser;
				paddle.state = paddle.transitions.morphingfromlaser;
				this.delete();
				paddle.state.callback = callback;
				paddle.scene.updatelist.push(paddle.transitions.morphingfromlaser);
				paddle.state.animationtimer = d.getTime();
			},
			transition2dead : function(){
				
				paddle.currentanimation = paddle.animationsobj.die;
				paddle.state = paddle.transitions.dead;
				this.delete();
				paddle.scene.updatelist.push(paddle.transitions.dead);
				paddle.state.animationtimer = d.getTime();
				powerupcontroller.deleteAll();
				powerupcontroller.resetPowerups(() => {});
			}
		},
		dead : { 
			istransition : true,
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
				paddle.typeenum = powerupenum.normal;
				paddle.currentanimation = paddle.animationsobj.startup;
				paddle.state = paddle.transitions.init;
				this.respawnready = false;
				//ball.resetspeed();
				this.delete();
				ballcontroller.addball(
							canvas.width, // speed
							new Vector2(0,-1), //direction
							new Vector2(paddle.rect.pos.x + paddle.rect.w/2, paddle.rect.pos.y - (4*ball.scalefactor) - 1),// position
							true // is stuck to bat
						);
				//ball.rect.pos = new Vector2(paddle.rect.pos.x + paddle.rect.w/2, paddle.rect.pos.y - (4*ball.scalefactor) - 1);
				//ball.sticktobat();
				gamecontroller.decrementlives();
				paddle.scene.updatelist.push(paddle.transitions.init);
				paddle.state.animationtimer = d.getTime();
			},
			delete : function(){
				for(let i=0; i < paddle.scene.updatelist.length; i++){
					if(paddle.scene.updatelist[i] === this){
						paddle.scene.updatelist.splice(i,1);
					}
				}
			}
		}
	},

	
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

		//long transition
		sheight = 8;
		swidth = 48
		numcolumns = 3;
		numrows = 1;
		subgridorigin = new Vector2(0,96);
		this.animationsobj.golong.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.golong.offset = new Rect(new Vector2(0,0),1,1);

		//long idle
		sheight = 8;
		swidth = 48;
		subgridorigin = new Vector2(0,104);
		numcolumns = 4;
		numrows = 4;
		this.animationsobj.long.frames = this.loadanimation(sheight,swidth,subgridorigin,numcolumns,numrows);
		this.animationsobj.long.offset = new Rect(new Vector2(0,0),1,1);

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
		let shadowsrect = null;
		if(this.state.drawshadow != null){ // draw overlays over the original bat
			this.state.drawshadow();
		}
		if(this.state == this.transitions.normal ||
			this.state == this.transitions.morphingtolong ||
			this.state == this.transitions.morphingfromlong){
			shadowsrect = this.animationsobj.normalshadow;
		}
		else if(this.state == this.transitions.long){
			shadowsrect = this.animationsobj.longshadow;
		}
		else if(this.state == this.transitions.laser || this.state == this.transitions.morphingtolaser || this.state == this.transitions.morphingfromlaser){
			shadowsrect = this.animationsobj.lasershadow;
		}
		let shadowpos = new Vector2(this.rect.pos.x + this.rect.w/2, this.rect.pos.y + this.rect.h/2);
		if(shadowsrect != null){
			ctx.drawImage(this.img, shadowsrect.pos.x, shadowsrect.pos.y, shadowsrect.w, shadowsrect.h, shadowpos.x, shadowpos.y, shadowsrect.w * this.scalefactor, shadowsrect.h*this.scalefactor)
		}
		let srect = this.currentframespritesheetrect;
		if(srect != null){
			ctx.drawImage(this.img, srect.pos.x, srect.pos.y, srect.w, srect.h, this.rect.pos.x + this.currentanimation.offset.pos.x , this.rect.pos.y + this.currentanimation.offset.pos.y, this.rect.w*this.currentanimation.offset.w, this.rect.h*this.currentanimation.offset.h);
		}
		if(this.state.draw != null){ // draw overlays over the original bat
			this.state.draw();
		}
		for(let i=0; i<this.projectiles.length; i++){
			this.projectiles[i].draw();
		}
		
	},
	loadimage : function(){
		var normalpaddleimg = new Image();
		normalpaddleimg.onload = function(){
			loadscreen.registerloadedfile();
			paddle.img = this;
			//paddle.init(this);
		}
		normalpaddleimg.src = normalpaddleURL;
	},
	init : function(){
		this.scalefactor = levelspawner.blockw/16;//1.5 * (canvas.width/330);
		this.rect = new Rect(new Vector2(canvas.width/2,canvas.height - (40*canvas.width/330)), 0,0);
		this.rect.w = (this.img.width/15) * this.scalefactor;
		this.rect.h = (this.img.height/28) * this.scalefactor;
		
		this.normalwidth = this.rect.w;
		
		this.initanimations();
		this.currentanimation = this.animationsobj.startup;
		this.state = this.transitions.init;
		this.scene.drawlist[this.drawlayer].push(this);
		this.scene.updatelist.push(this.state);
	},
	move(deltaX){
		if(this.state != this.transitions.dead && this.state != this.transitions.init){
			this.rect.pos.x += deltaX;
			if(this.rect.pos.x < 0){
				this.rect.pos.x = 0;
			}
			else if(this.rect.pos.x > canvas.width - this.rect.w){
				this.rect.pos.x = canvas.width - this.rect.w;
			}
		}
		
	},
	shoot : function(){
		audio.play(audio.sounds["lasershoot"]);
		let w = (this.img.width/30) * this.scalefactor;
		let h = (this.img.height/28) * this.scalefactor;

		let p = new Projectile(this.img, this.animationsobj.laserprojectile,w,h);

		this.projectiles.push(p);
		this.scene.updatelist.push(p);
	},
	unpauseall : function(){
		for(let i=0; i< this.projectiles.length; i++){
			this.projectiles[i].unpause();
		}
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
		this.scene = scene.scenes.playing;
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
		for(let i=0; i<this.scene.updatelist.length; i++){
			if(this.scene.updatelist[i] == this){
				this.scene.updatelist.splice(i,1);
			}
		}
	}
	draw(){

		ctx.drawImage(this.img, this.srect.pos.x, this.srect.pos.y, this.srect.w, this.srect.h, this.rect.pos.x, this.rect.pos.y, this.rect.w, this.rect.h);
	}
	unpause(){
		this.last = d.getTime();
	}
}
