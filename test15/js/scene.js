var scene = {
	scenes : {
		chooseLevelSet :{
			canstart : false,
			a1rect : undefined,
			a2rect : undefined,
			a1text : "Arkanoid 1",
			a2text : "Arkanoid 2",
			a1colour : null,
			a2colour : null,
			buttonmargin : 6,
			chosenset : null,
			chosenrect : null,
			clicklistener : function(e){

			},
			mousemovelistener : function(e){

			},
			mouseuplistener : function(e){
				let touch = input.getcanvasrelative(e);
				if(scene.scenes.chooseLevelSet.chosenrect){
					if(Rect.isPointInRect(touch, scene.scenes.chooseLevelSet.chosenrect)){
						scene.changescene(scene.scenes.lvlSelectMenu);
					}
					else{
						scene.scenes.chooseLevelSet.chosenrect = null;
						scene.scenes.chooseLevelSet.a1colour = "blue";
						scene.scenes.chooseLevelSet.a2colour = "blue";
					}
				}
			},
			mousedownlistener : function(e){
				let touch = input.getcanvasrelative(e);
				console.log(touch);
				console.log(scene.scenes.chooseLevelSet.a1rect);
				console.log();

				if(Rect.isPointInRect(touch, scene.scenes.chooseLevelSet.a1rect)){
		            scene.scenes.chooseLevelSet.chosenset = scene.scenes.chooseLevelSet.a1text;
		            scene.scenes.chooseLevelSet.canstart = true;
		            scene.scenes.chooseLevelSet.a1colour = "green";
		            scene.scenes.chooseLevelSet.chosenrect = scene.scenes.chooseLevelSet.a1rect
		            console.log("a1");
		        }
		        else if(Rect.isPointInRect(touch, scene.scenes.chooseLevelSet.a2rect)){
		            scene.scenes.chooseLevelSet.chosenset = scene.scenes.chooseLevelSet.a2text;
		            scene.scenes.chooseLevelSet.canstart = true;
		            scene.scenes.chooseLevelSet.a2colour = "green";
		            scene.scenes.chooseLevelSet.chosenrect = scene.scenes.chooseLevelSet.a2rect
		            console.log("a2");
		        }
			},
			touchuplistener : function(e){
				let touch = {x : input.lasttouch.pageX, y: input.lasttouch.pageY};
				if(scene.scenes.chooseLevelSet.chosenrect){
					if(Rect.isPointInRect(touch, scene.scenes.chooseLevelSet.chosenrect)){
						scene.changescene(scene.scenes.lvlSelectMenu);
					}
					else{
						scene.scenes.chooseLevelSet.chosenrect = null;
						scene.scenes.chooseLevelSet.a1colour = "blue";
						scene.scenes.chooseLevelSet.a2colour = "blue";
					}
				}
				
			},
			touchdownlistener : function(e){
				let touch = {x : input.lasttouch.pageX, y: input.lasttouch.pageY};
				if(Rect.isPointInRect(touch, scene.scenes.chooseLevelSet.a1rect)){
		            scene.scenes.chooseLevelSet.chosenset = scene.scenes.chooseLevelSet.a1text;
		            scene.scenes.chooseLevelSet.canstart = true;
		            scene.scenes.chooseLevelSet.a1colour = "green";
		            scene.scenes.chooseLevelSet.chosenrect = scene.scenes.chooseLevelSet.a1rect
		        }
		        else if(Rect.isPointInRect(touch, scene.scenes.chooseLevelSet.a2rect)){
		            scene.scenes.chooseLevelSet.chosenset = scene.scenes.chooseLevelSet.a2text;
		            scene.scenes.chooseLevelSet.canstart = true;
		            scene.scenes.chooseLevelSet.a2colour = "green";
		            scene.scenes.chooseLevelSet.chosenrect = scene.scenes.chooseLevelSet.a2rect
		        }
			},
			touchmovelistener : function(e){
			},
			previousscene : null,
			update : function(){
			},
			draw : function(){
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.font = "30px digital7";

				ctx.fillStyle = this.a1colour;
				ctx.fillRect(scene.scenes.chooseLevelSet.a1rect.pos.x, scene.scenes.chooseLevelSet.a1rect.pos.y, scene.scenes.chooseLevelSet.a1rect.w, scene.scenes.chooseLevelSet.a1rect.h);
				ctx.fillStyle = this.a2colour;
				ctx.fillRect(scene.scenes.chooseLevelSet.a2rect.pos.x, scene.scenes.chooseLevelSet.a2rect.pos.y, scene.scenes.chooseLevelSet.a2rect.w, scene.scenes.chooseLevelSet.a2rect.h);

				ctx.font = "30px digital7";
				ctx.strokeStyle = 'white';
				ctx.strokeText(scene.scenes.chooseLevelSet.a1text, scene.scenes.chooseLevelSet.a1rect.pos.x + scene.scenes.chooseLevelSet.buttonmargin, scene.scenes.chooseLevelSet.a1rect.pos.y +30 );

				ctx.strokeText(scene.scenes.chooseLevelSet.a2text, scene.scenes.chooseLevelSet.a2rect.pos.x + scene.scenes.chooseLevelSet.buttonmargin, scene.scenes.chooseLevelSet.a2rect.pos.y +30);
				ctx.stroke();


				sliderctx.fillStyle = 'white';
				sliderctx.fillRect(0,0, sliderc.width,scorec.height);
				debug();
			},
			init : function(){
				ctx.font = "30px digital7";

				let buttonmargin = this.buttonmargin;
				let a1info = ctx.measureText(this.a1text);
				let a2info = ctx.measureText(this.a2text);

				let b1y = canvas.height/3 - (30+2*buttonmargin)/2;
				let b2y = 2*(canvas.height/3) - (30+2*buttonmargin)/2;

				let b1x = canvas.width/2 - (a1info.width+2*buttonmargin)/2;
				let b2x = canvas.width/2 - (a2info.width+2*buttonmargin)/2;

				this.a1rect = new Rect(new Vector2(b1x, b1y), a1info.width+2*buttonmargin, 30+2*buttonmargin);
				this.a2rect = new Rect(new Vector2(b2x, b2y), a2info.width+2*buttonmargin, 30+2*buttonmargin);
				this.canstart =false;
				a1colour = "blue";
				a2colour = "blue";
			},
			end : function(){
				switch(this.chosenset){
					case this.a1text:
						origwidth = 11*16;
						origheight = 28*8;
						selectmenu.lvlset = levels.NES;
						levelspawner.lvlset = levels.NES;
						break;
					case this.a2text:
						origwidth = 13*16;
						origheight = 29*8;
						selectmenu.lvlset = levels.RofD;
						levelspawner.lvlset = levels.RofD;
						break;
				}
				resizeGame();
			},
			setupInput(){
				input.setnewinputlisteners(this.touchuplistener, 
											this.touchdownlistener, 
											this.touchmovelistener, 
											this.mousemovelistener, 
											this.clicklistener,
											this.mousedownlistener,
											this.mouseuplistener);
				document.body.addEventListener("wheel", function(e){
					console.log(e.deltaY);
					if(e.deltaY < 0){
						//selectmenu.scrollpos -= selectmenu.imgwidth*selectmenu.scalefactor + 2*(selectmenu.imgwidth*selectmenu.scalefactor*selectmenu.margin);
						selectmenu.scrollpos -= selectmenu.imgwidth/2;
					}
					else{
						//selectmenu.scrollpos += selectmenu.imgwidth*selectmenu.scalefactor + 2*(selectmenu.imgwidth*selectmenu.scalefactor*selectmenu.margin);
						selectmenu.scrollpos += selectmenu.imgwidth/2;
					}
				});
			}
		},
		lvlSelectMenu : {
			canstart : false,
			clicklistener : function(e){

			},
			mousemovelistener : function(e){

			},
			mouseuplistener : function(e){
				selectmenu.currentbuttonframe = 0;
		        //let touch = {x : input.lasttouch.pageX, y: input.lasttouch.pageY};
		        let touch = input.getcanvasrelative(e);
		        if(Rect.isPointInRect(touch, selectmenu.startbuttonrect)){
		            if(selectmenu.selectedrect != null && this.canstart){
		                levelspawner.levelindex = selectmenu.selectedrect;
		                scene.changescene(scene.scenes.playing);
		            }
		        }
		        else{
		        	this.canstart = false;
		        }
			},
			mousedownlistener : function(e){
				//let touch = {x : input.lasttouch.pageX, y: input.lasttouch.pageY};
				let touch = input.getcanvasrelative(e);
		        for(let i=0; i<selectmenu.levelrects.length; i++){
		            if(Rect.isPointInRect(touch, selectmenu.levelrects[i].rect)){
		                selectmenu.selectedrect = selectmenu.levelrects[i].number;
		                break;
		            }
		        }
		        if(Rect.isPointInRect(touch, selectmenu.startbuttonrect)){
		            selectmenu.currentbuttonframe = 1;
		            this.canstart = true;
		        }
			},
			touchuplistener : function(e){
				selectmenu.currentbuttonframe = 0;
		        let touch = {x : input.lasttouch.pageX, y: input.lasttouch.pageY};
		        if(Rect.isPointInRect(touch, selectmenu.startbuttonrect)){
		            if(selectmenu.selectedrect != null && this.canstart){
		                levelspawner.levelindex = selectmenu.selectedrect;
		                scene.changescene(scene.scenes.playing);
		            }
		        }
		        else{
		        	this.canstart = false;
		        }
			},
			touchdownlistener : function(e){
				let touch = {x : input.lasttouch.pageX, y: input.lasttouch.pageY};
		        for(let i=0; i<selectmenu.levelrects.length; i++){
		            if(Rect.isPointInRect(touch, selectmenu.levelrects[i].rect)){
		                selectmenu.selectedrect = selectmenu.levelrects[i].number;
		                break;
		            }
		        }
		        if(Rect.isPointInRect(touch, selectmenu.startbuttonrect)){
		            selectmenu.currentbuttonframe = 1;
		            this.canstart = true;
		        }
    
			},
			touchmovelistener : function(e){
				selectmenu.scrollpos += input.deltaX;
			},
			previousscene : null,
			update : function(){
				selectmenu.update();
			},
			draw : function(){
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				sliderctx.fillStyle = 'white';
				sliderctx.fillRect(0,0, sliderc.width,scorec.height);
				debug();
				selectmenu.draw();
			},
			init : function(){
				selectmenu.init();
				this.canstart =false;
			},
			end : function(){
				
			},
			setupInput(){
				input.setnewinputlisteners(this.touchuplistener, 
											this.touchdownlistener, 
											this.touchmovelistener, 
											this.mousemovelistener, 
											this.clicklistener,
											this.mousedownlistener,
											this.mouseuplistener);
			}
		},
		playing : {
			previousscene : null,
			drawlist : [[],[],[],[],[]], // layer 0: ball, layer 1: blocks, layer 2: powerups, layer 3 : bat
			updatelist : [],
			paused : false,
			mousedownlistener : function(e){
				if(!scene.scenes.playing.paused){
					let touch = input.getcanvasrelative(e);
			        if(Rect.isPointInRect(touch, gamecontroller.backbuttonrect)){
			            scene.changescene(scene.scenes.lvlSelectMenu);
			        }
			        gamecontroller.launchball();
		    	}
			},
			mouseuplistener : function(e){
				//if(!scene.scenes.playing.paused){gamecontroller.launchball();}
			},
			mousemovelistener : function(e){
				if(!scene.scenes.playing.paused){
					paddle.move(e.movementX);
				}
			},
			clicklistener : function(e){
				//if(!scene.scenes.playing.paused){gamecontroller.launchball();}
			},
			touchuplistener : function(e){
				if(!scene.scenes.playing.paused){
					gamecontroller.launchball(e);
			        // if(paddle.state == paddle.transitions.laser){
			        //     paddle.shoot();
			        // }
				}
				
			},
			touchdownlistener : function(e){
				if(!scene.scenes.playing.paused){
					let touch = input.getcanvasrelative(e);
			        if(Rect.isPointInRect(touch, gamecontroller.backbuttonrect)){
			            scene.changescene(scene.scenes.lvlSelectMenu);
			        }
		    	}
			},
			touchmovelistener : function(e){
				if(!scene.scenes.playing.paused){
					paddle.move(input.deltaX);
				}
				
			},
			update : function(){
				if(!scene.scenes.playing.paused){
					for(var i=0; i<scene.scenes.playing.updatelist.length; i++){
						scene.scenes.playing.updatelist[i].update();
					}
				}
				else{
					for(let i=0; i<ballcontroller.balls.length; i++){
						//ballcontroller.balls[i].rect.pos = ballcontroller.balls[i].lastpos;
						ballcontroller.balls[i].last = d.getTime();
					}
				}
				
			},
			draw : function(){
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				sliderctx.fillStyle = 'white';
				sliderctx.fillRect(0,0, sliderc.width,scorec.height);
				background.drawbackground();
				for(let i=0; i<levelspawner.blocks.length; i++){
					levelspawner.blocks[i].drawshadow();
				}
				for(var i=0; i<scene.scenes.playing.drawlist.length; i++){ // iterate through layers
					for(var j=0; j<scene.scenes.playing.drawlist[i].length; j++){ // draw each thing in the layer
						scene.scenes.playing.drawlist[i][j].draw();
					}
				}
				//drawdebugpanel();
				gamecontroller.drawinfopanel();
			},
			togglepause : function(){
				if(!this.paused){
					this.paused = true;
				}
				else if(this.paused){
					paddle.unpauseall();
					ballcontroller.unpauseall();
					powerupcontroller.unpauseall();
					this.paused = false;
				}
			},
			init : function(){
				canvas.requestPointerLock = canvas.requestPointerLock ||
			    canvas.mozRequestPointerLock ||
			    canvas.webkitRequestPointerLock;
				canvas.requestPointerLock();
				levelspawner.makelevel();
				paddle.init();
				ballcontroller.addball(
										canvas.width, // speed
										new Vector2(0,-1), //direction
										new Vector2(paddle.rect.pos.x + paddle.rect.w/2, paddle.rect.pos.y - (4*paddle.scalefactor) - 1),// position
										true // is stuck to bat
									);
				
				background.init();
				//gamecontroller.playing = true;
				gamecontroller.init();
			},
			setupInput : function(){
				input.setnewinputlisteners(this.touchuplistener, 
											this.touchdownlistener, 
											this.touchmovelistener, 
											this.mousemovelistener, 
											this.clicklistener,
											this.mousedownlistener,
											this.mouseuplistener);


			},
			end : function(){
				this.updatelist = [];
				this.drawlist = [[],[],[],[],[]];
				ballcontroller.mainball = null;
				ballcontroller.balls = [];
				paddle.projectiles = [];
				ball.willsticktobat = false;
			}
		}
	},
	currentscene : null,
	changescene : function(s){
		if(scene.currentscene != null){
			scene.currentscene.end();
			s.previousscene = scene.currentscene;
		}
		scene.currentscene = s;
		s.setupInput();
		s.init();
		updateAll = s.update;
		drawAll = s.draw; 
		
	}
}