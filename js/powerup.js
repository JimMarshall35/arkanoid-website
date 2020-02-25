var powerupcontroller = {
	powerups : []
}
class Powerup{
	constructor(rect, spritecoords){
		this.rect = rect;
		this.spritecoords = spritecoords;
		this.drawlayer = 3;
		this.speed = 4
	}
	draw(){

	}
	update(){

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
	release(pos){
		drawlist[this.drawlayer].push(this);
		updatelist.push(this);
	}
}