function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
var levelspawner = {
	blocks : [],
	powerupsperblock : 0.2,
	playfield : null,
	collidableblocks : [],
	specialloaded : false,
	normalloaded :false,
	poweruploaded : false,
	levelindex : getRandomIntInclusive(0,34),
	specialimage : null,
	normalimage : null,
	powerupimage : null,
	toprightangle : 0,
	bottomrightangle : 0,
	deleteall : function(){
		if(this.blocks[0]){
			this.blocks[0].delete();
			this.deleteall();
		}
	},
	init : function(){
		this.deleteall();
		this.initcollidableblocks();
		console.log("after reset there are: " + this.collidableblocks.length + " collidable blocks out of " + this.blocks.length + " blocks");
		this.makelevel();
	},
	loadimage : function(){
		var specialimg = new Image();
		var normalimg = new Image();
		var pupimg = new Image();
		specialimg.onload = function(){
			
			console.log("special");
			levelspawner.specialloaded = true;
			levelspawner.specialimage = this;
			if(levelspawner.normalloaded && levelspawner.poweruploaded){
				console.log("special loaded first")
				//levelspawner.makelevel();
			}
			loadscreen.registerloadedfile();
		}
		specialimg.src = specialblocksURL;
		normalimg.onload = function(){
			
			console.log("normal");
			levelspawner.normalloaded = true;
			levelspawner.normalimage = this;
			if(levelspawner.specialloaded && levelspawner.poweruploaded){

				//levelspawner.makelevel();
			}
			loadscreen.registerloadedfile();
		}
		console.log("loadimage");
		normalimg.src = normalblocksURL;
		pupimg.onload = function(){
			console.log("powerup");
			levelspawner.poweruploaded = true;
			levelspawner.powerupimage = this;
			if(levelspawner.specialloaded && levelspawner.normalloaded){
			
			}
			loadscreen.registerloadedfile();
		}
		pupimg.src = powerupURL;

	},
	getbreakableblocks : function(){
		let b = [];
		for(let i = 0; i<this.blocks; i++){
			if(this.blocks[i].silver || this.blocks[i].gold){
				continue;
			}
			b.push(this.blocks[i]);
		}
		return b;
	},
	findvalidindex : function(b, rindexes){

		let r = getRandomIntInclusive(0,b.length);
		for(let i=0; i<rindexes.length; i++){
			if(r == rindexes[i]){
				findvalidindex(b, rindexes);
			}
		}
		return r;

	},
	setpowerups : function(){
		let b = getbreakableblocks();
		let num = Math.round(this.blocks.length/this.powerupsperblock);
		let rindexes = [];
		for(let i=0; i<num; i++){
			rindexes.push(findvalidindex(b,rindexes));
		}
		
	},
	initblockangles : function(){
		let columns = levels.NES[this.levelindex][0].length;
		let rows = levels.NES[this.levelindex].length;
		let blockwidth = canvas.width / columns;
		let blockheight = canvas.height / rows;
		let m2t = new Vector2(blockwidth/2,0).subtract(new Vector2(blockwidth/2, blockheight/2));
		let m2tr = new Vector2(blockwidth,0).subtract(new Vector2(blockwidth/2, blockheight/2));
		let m2br = new Vector2(blockwidth,blockheight).subtract(new Vector2(blockwidth/2, blockheight/2));
		this.toprightangle = m2t.getUnsignedAngle(m2tr);
		this.bottomrightangle = m2t.getUnsignedAngle(m2br);
	},
	getplayfieldrect : function(){
		let height = canvas.height;
		let width = height * 0.7366071428571429;
		let x = canvas.width - width/2;
		let y = 0;
		this.playfield = new Rect(new Vector2(x,y),width,height);
		console.log(this.playfield);
		paddle.scalefactor = height / 448;
		ball.scalefactor = height / 448;
		paddle.setrect();
	},
	makelevel : function(){
		this.blocks = [];
		let level = levels.NES[this.levelindex];
		this.getplayfieldrect();
		let blockwidth = this.playfield.width/ 11;
		let blockheight = this.playfield.height / 28;
		let cursor = {x:this.playfield.pos.x, y:this.playfield.pos.y};
		for(var i=0; i < level.length; i++){
			for(var j=0; j < level[i].length; j++){
				let blockindex = level[i][j];
				cursor.x = j*blockwidth;
				cursor.y = i*blockheight;
				if(blockindex > 0){
					let spritecoords = this.blockkey[blockindex - 1];
					if(blockindex == 9 || blockindex == 10){
						let block = new SpecialBlock(new Rect(new Vector2(cursor.x,cursor.y),blockwidth,blockheight), spritecoords, this.specialimage,{x:j, y:i});
						if(blockindex == 10){
							block.gold = true;
						}
						else{
							block.silver = true;
						}
						this.blocks.push(block);
					}
					else{
						this.blocks.push(new Block(new Rect(new Vector2(cursor.x,cursor.y),blockwidth,blockheight), spritecoords, this.normalimage,{x:j, y:i}));
					}
				}

			}
			
		}
		//console.log("no of blocks: " + this.blocks.length);
		//console.log("no collidable: " + this.collidableblocks.length);
		this.initcollidableblocks();
		
		console.log(this.collidableblocks);
		console.log(this.blocks);
		this.initblockangles();
	},
	initcollidableblocks : function(){
		this.collidableblocks = [];
		for(let block of this.blocks){
			let thisx = block.gridcoords.x;
			let thisy = block.gridcoords.y;
			let neighbours = [false,false,false,false]; // left, right, up, down
			if(thisx == 0){                             // block is on the far left of the row
				neighbours[0] = true;
			}
			else if(thisx == levels.NES[this.levelindex][0].length - 1){ // block is on the far right of the row
				neighbours[1] = true;
			}
			else if(thisy == 0){                             // block is at the very top of the column
				neighbours[2] = true;
			}
			else if(thisy == levels.NES[this.levelindex].length - 1){ // block is at the very bottom of the column
				neighbours[3] = true;
			}
			for(let otherblock of this.blocks){
				if(otherblock == block){
					continue;
				}
				let otherx = otherblock.gridcoords.x;
				let othery = otherblock.gridcoords.y;
				if(otherx == thisx -1 && othery == thisy){ // block to the left
					neighbours[0] = true;
				}
				else if(otherx == thisx +1 && othery == thisy){
					neighbours[1] = true
				}
				else if(othery == thisy -1 && otherx == thisx){
					neighbours[2] = true;
				} 
				else if(othery == thisy +1 && otherx == thisx){
					neighbours[3] = true;
				}
			}
			let push = false;
			for(let neighbour of neighbours){
				if(!neighbour){
					push = true;
					break;
				}
			}
			if(push){
				this.collidableblocks.push(block);
			}
			
		}
		console.log("no of blocks: " + this.blocks.length);
		console.log("no collidable: " + this.collidableblocks.length);
	},
	blockkey : [
		{x:0, y:0},
		{x:1, y:0},
		{x:2, y:0},
		{x:3, y:0},
		{x:0, y:1},
		{x:1, y:1},
		{x:2, y:1},
		{x:3, y:1},
		{x:0, y:0}, //9 - silver
		{x:0, y:1}  //10 - gold
	]
}
