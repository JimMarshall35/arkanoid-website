class Block{
	constructor(rect, spritecoords, img, gridcoords){
		this.rect = rect;
		this.spritecoords = spritecoords;
		this.img = img;
		this.gridcoords = gridcoords
		this.silver = false;
		this.gold = false;
		this.health = 1;
		this.drawlayer = 2;
		drawlist[this.drawlayer].push(this);
	}

	draw(){
		let swidth = this.img.width/4;
		let sheight = this.img.height/2;
		let sx = this.spritecoords.x * swidth;
		let sy = this.spritecoords.y * sheight;
		ctx.drawImage(this.img, sx, sy, swidth, sheight, this.rect.pos.x, this.rect.pos.y, this.rect.w, this.rect.h);
	}
	delete(){
		//console.log(drawlist.length);
		for(let i = 0; i<drawlist[this.drawlayer].length; i++){
			if(drawlist[this.drawlayer][i] == this){
				drawlist[this.drawlayer].splice(i, 1);
			}
		}
		for(let i = 0; i<levelspawner.blocks.length; i++){
			if(levelspawner.blocks[i] == this){
				levelspawner.blocks.splice(i, 1);
			}
		}
		for(let i = 0; i<levelspawner.collidableblocks.length; i++){
			if(levelspawner.collidableblocks[i] == this){
				levelspawner.collidableblocks.splice(i, 1);
			}
		}
		//console.log(drawlist.length);
	}
}
class SpecialBlock{
	constructor(rect, spritecoords, img, gridcoords){
		this.gridcoords = gridcoords
		this.rect = rect;
		this.spritecoords = spritecoords;
		this.img = img;
		this.flashtime = 500;
		this.waittime = 5000;
		this.animationtimer;
		this.waittimer = d.getTime();
		this.onlyonce = true;
		this.silver = false;
		this.gold = false;
		this.health = 2;
		this.drawlayer = 2;
		drawlist[this.drawlayer].push(this);
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
	delete(){
		//console.log(drawlist.length);
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
		for(let i = 0; i<levelspawner.blocks.length; i++){
			if(levelspawner.blocks[i] == this){
				levelspawner.blocks.splice(i, 1);
			}
		}
		for(let i = 0; i<levelspawner.collidableblocks.length; i++){
			if(levelspawner.collidableblocks[i] == this){
				levelspawner.collidableblocks.splice(i, 1);
			}
		}
		//console.log(drawlist.length);
	}
}
