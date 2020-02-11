class Block{
	constructor(rect, spritecoords, img){
		this.rect = rect;
		this.spritecoords = spritecoords;
		this.img = img;
		drawlist[1].push(this);
	}

	draw(){
		let swidth = this.img.width/4;
		let sheight = this.img.height/2;
		let sx = this.spritecoords.x * swidth;
		let sy = this.spritecoords.y * sheight;
		ctx.drawImage(this.img, sx, sy, swidth, sheight, this.rect.pos.x, this.rect.pos.y, this.rect.w, this.rect.h);
	}
}
class SpecialBlock{
	constructor(rect, spritecoords, img){
		this.rect = rect;
		this.spritecoords = spritecoords;
		this.img = img;
		this.flashtime = 500;
		this.waittime = 5000;
		this.animationtimer;
		this.waittimer = d.getTime();
		this.onlyonce = true;
		drawlist[1].push(this);
		updatelist.push(this);
	}

	draw(){
		let swidth = this.img.width/6;
		let sheight = this.img.height/3;
		let sx = this.spritecoords.x * swidth;
		let sy = this.spritecoords.y * sheight;
		ctx.drawImage(this.img, sx, sy, swidth, sheight, this.rect.pos.x, this.rect.pos.y, this.rect.w, this.rect.h);
	}
	update(){
		let time = d.getTime() - this.waittimer;
		if(time > this.waittime){
			if(this.onlyonce){
				this.animationtimer = d.getTime();
				this.onlyonce = false;
			}
			time = d.getTime() - this.animationtimer;
			if(time > this.flashtime){
				this.spritecoords.x = 0;
				this.waittimer = d.getTime();
				this.onlyonce = true;
				return;
			}
			let index = Math.round((time/this.flashtime)*5);
			this.spritecoords.x = index;

		}
	}
}