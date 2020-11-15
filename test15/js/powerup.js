var powerupcontroller = {
	img : null,
	loadimage : function(){
		var pimage = new Image();
		pimage.onload = function(){
			loadscreen.registerloadedfile();
			powerupcontroller.init(this);
		}
		pimage.src = powerupURL;

	},
	init : function(img){
		this.img = img;
	},
	powerups : [],
	resetPowerups : function(effectcallback){
		ball.willsticktobat = false;
		
		if(paddle.state !== paddle.transitions.normal && !paddle.state.istransition){
			paddle.state.transition2normal(effectcallback);
		}
		else{
			effectcallback();
		}
	},
	deleteAll : function(){
		for(let i=0; i<this.powerups; i++){
			this.powerups[i].delete();
		}
	},
	unpauseall : function(){
		for(let i=0; i<this.powerups.length; i++){
			this.powerups[i].unpause();
		}
	}
}
var powerupenum = {
	normal : 0,
	long : 1,
	laser : 2,
	sticky : 3,

}
class PowerupBase{
	constructor(rect, spritecoords){
		this.rect = rect;
		this.spritecoords = spritecoords;
		this.drawlayer = 2;
		this.speed = canvas.width/2;
		this.timebetweenframes = 0.2;
		this.animationtimer = 0;
		this.last = null;
		this.velocity = new Vector2(0,1*this.speed);
		this.typeenum = null;
		this.reset = true;
		this.scene = scene.scenes.playing;
	}
	draw(){
		let swidth = (powerupcontroller.img.width)/8;
		let sheight = (powerupcontroller.img.height)/10;
		let sx = this.spritecoords.x * swidth;
		let sy = this.spritecoords.y * sheight;
		ctx.drawImage(powerupcontroller.img, sx, sy, swidth, sheight, this.rect.pos.x, this.rect.pos.y, this.rect.w, this.rect.h);
	}
	unpause(){
		this.last = d.getTime();
	}
	update(){
		if(this.rect.y >= canvas.height){
			this.delete();
		}
		let time = d.getTime();
		let deltatime = (time - this.last)/1000;
		this.last = time;
		this.animationtimer += deltatime;
		if(this.animationtimer >= this.timebetweenframes){
			this.spritecoords.x++;
			if(this.spritecoords.x > 7){
				this.spritecoords.x = 0;
			}
			this.animationtimer = 0;
		}
		this.rect.pos = this.rect.pos.add(this.velocity.multiplyByScalar(deltatime));
		if(Rect.testCollision(this.rect, paddle.rect) && !paddle.state.istransition){
			if(paddle.typeenum != this.typeenum){
				if(this.reset){
					powerupcontroller.resetPowerups(this.effect);
				}
				else{
					this.effect();
				}
					
			}
			else{
				this.effect();
			}
			this.delete();
				
				
		}

	}
	effect(){

	}
	delete(){
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
		for(let i = 0; i<powerupcontroller.powerups.length; i++){
			if(powerupcontroller.powerups[i] == this){
				powerupcontroller.powerups.splice(i, 1);
			}
		}
	}
	release(){
		this.scene.drawlist[this.drawlayer].push(this);
		this.scene.updatelist.push(this);
		powerupcontroller.powerups.push(this);
		this.last = d.getTime();
	}
}
class StickPowerup extends PowerupBase{
	constructor(rect, spritecoords){
		super(rect,spritecoords);
		super.typeenum = powerupenum.sticky;
		this.effect = this.effect.bind(this);
	}
	effect(){

		ball.willsticktobat = true;
		paddle.typeenum = this.typeenum;
	}
}
class LaserPowerup extends PowerupBase{
	constructor(rect, spritecoords){
		super(rect,spritecoords);
		super.typeenum = powerupenum.laser;
		this.effect = this.effect.bind(this);
	}
	effect(){
		if(paddle.state == paddle.transitions.normal && !ball.willsticktobat){

			paddle.state.transition2laser();
			paddle.typeenum = this.typeenum;
		}
		
	}
}
class LongPowerup extends PowerupBase{
	constructor(rect, spritecoords){
		super(rect,spritecoords);
		super.typeenum = powerupenum.long;
		this.effect = this.effect.bind(this);
	}
	effect(){
		if(paddle.state == paddle.transitions.normal && !ball.willsticktobat){
			paddle.state.transition2long();
			paddle.typeenum = this.typeenum;
		}
	}
}
class TriBall extends PowerupBase{
	constructor(rect, spritecoords){
		super(rect,spritecoords);
		super.typeenum = powerupenum.long;
		this.effect = this.effect.bind(this);
		this.reset = false;
	}
	effect(){
		ballcontroller.addballs(2);
	}
}
class PlaceHolderPowerup extends PowerupBase{
	effect(){

	}
}