var powerupcontroller = {
	img : null,
	loadimage : function(){
		var pimage = new Image();
		pimage.onload = function(){
			console.log("ploaded");
			loadscreen.registerloadedfile();
			powerupcontroller.init(this);
		}
		pimage.src = powerupURL;

	},
	init : function(img){
		this.img = img;
	},
	powerups : []
}
class PowerupBase{
	constructor(rect, spritecoords){
		this.rect = rect;
		this.spritecoords = spritecoords;
		this.drawlayer = 3;
		this.speed = 300;
		this.timebetweenframes = 0.2;
		this.animationtimer = 0;
		this.last = null;
		this.velocity = new Vector2(0,1*this.speed);
	}
	draw(){
		let swidth = (powerupcontroller.img.width)/8;
		let sheight = (powerupcontroller.img.height)/10;
		let sx = this.spritecoords.x * swidth;
		let sy = this.spritecoords.y * sheight;
		ctx.drawImage(powerupcontroller.img, sx, sy, swidth, sheight, this.rect.pos.x, this.rect.pos.y, this.rect.w, this.rect.h);
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
		if(Rect.testCollision(this.rect, paddle.rect)){
			this.delete();
		}

	}
	delete(){
		for(let i = 0; i<drawlist[this.drawlayer].length; i++){
			if(drawlist[this.drawlayer][i] == this){
				drawlist[this.drawlayer].splice(i, 1);
			}
		}
		for(let i = 0; i<updatelist.length; i++){
			if(updatelist[i] == this){
				updatelist.splice(i, 1);
			}
		}
		for(let i = 0; i<powerupcontroller.powerups.length; i++){
			if(powerupcontroller.powerups[i] == this){
				powerupcontroller.powerups.splice(i, 1);
			}
		}
	}
	release(){
		drawlist[this.drawlayer].push(this);
		updatelist.push(this);
		powerupcontroller.powerups.push(this);
		this.last = d.getTime();
	}
}
class StickPowerup extends PowerupBase{
	effect(){
		
	}
}