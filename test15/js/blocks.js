class BlockBase{
	constructor(rect, spritecoords, img, gridcoords){
		this.rect = rect;
		this.spritecoords = spritecoords;
		this.img = img;
		this.gridcoords = gridcoords
		this.silver = false;
		this.gold = false;
		this.drawlayer = 1;
		this.scene = scene.scenes.playing;
		this.scene.drawlist[this.drawlayer].push(this);
		this.neighbours = [];
	}
	drawshadow(){
		ctx.fillStyle = 'rgba(0,0,0,0.6)';
		ctx.fillRect(this.rect.pos.x + (this.rect.w*0.5), this.rect.pos.y + (this.rect.h*0.5), this.rect.w,this.rect.h);
	}
	decrementHealth(){
		if(!this.gold){
			this.health--;
		
			if(this.health <= 0){
				audio.play(audio.sounds["destroyblock"]);
				if(this.powerup != null){
					this.powerup.release();
				}
				this.delete();
				levelspawner.initcollidableblocks();
			}
			else{
				audio.play(audio.sounds["hitmetalblock"]);
			}
		}
		else{
			audio.play(audio.sounds["hitmetalblock"]);
		}
		
	}
	delete(){
		for(let i = 0; i<this.scene.drawlist[this.drawlayer].length; i++){
			if(this.scene.drawlist[this.drawlayer][i] == this){
				this.scene.drawlist[this.drawlayer].splice(i, 1);
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
		for(let i=0; i<this.neighbours.length; i++){

			let neighbour = this.neighbours[i];
			for(let j=0; j<neighbour.neighbours.length; j++){
				if(neighbour.neighbours[j] == this){
					neighbour.neighbours.splice(j, 1);
				}
			}
		}
		//ctx.clearRect(0,0,canvas.width,canvas.health);
	}

}
class Block extends BlockBase{
	constructor(rect, spritecoords, img, gridcoords){
		super(rect, spritecoords, img, gridcoords);
		this.health = 1;
		this.powerup = null;
	}
	
	draw(){
		
		let swidth = this.img.width/4;
		let sheight = this.img.height/2;
		let sx = this.spritecoords.x * swidth;
		let sy = this.spritecoords.y * sheight;
		ctx.drawImage(this.img, sx, sy, swidth, sheight, this.rect.pos.x, this.rect.pos.y, this.rect.w, this.rect.h);
		
	}
	
}
class SpecialBlock extends BlockBase{
	constructor(rect, spritecoords, img, gridcoords, silver, gold){
		super(rect, spritecoords, img, gridcoords);

		this.flashtime = 300;
		this.waittime = 5000;
		this.animationtimer;
		this.waittimer = d.getTime();
		this.onlyonce = true;
	
		this.health = 2;
		this.flash = false;
		this.silver = silver;
		this.gold = gold;
		

		this.scene.updatelist.push(this);
	}
	triggerflash(){
		if(!this.flash){
			this.flash = true;
		}
	}
	draw(){
		let swidth = this.img.width/6;
		let sheight = this.img.height/3;
		let sx = this.spritecoords.x * swidth;
		let sy = this.spritecoords.y * sheight;
		ctx.drawImage(this.img, sx, sy, swidth, sheight, this.rect.pos.x, this.rect.pos.y, this.rect.w, this.rect.h);
	}
	update(){

		if(this.flash){
			if(this.onlyonce){
				this.animationtimer = d.getTime();
				this.onlyonce = false;
			}
			let time = d.getTime() - this.animationtimer;
			if(time > this.flashtime){
				this.spritecoords.x = 0;
				this.waittimer = d.getTime();
				this.onlyonce = true;
				this.flash = false;
				if(!this.gold){
					this.spritecoords.y = 2;
				}
				return;
			}
			let index = Math.round((time/this.flashtime)*5);
			this.spritecoords.x = index;
		}
			
	}
	delete(){
		super.delete();
		for(let i = 0; i<this.scene.updatelist.length; i++){
			if(this.scene.updatelist[i] == this){
				this.scene.updatelist.splice(i, 1);
			}
		}
	}
	decrementHealth(){
		if(this.flash == false){
			this.flash = true;
		}
	 	super.decrementHealth();
	}
}
