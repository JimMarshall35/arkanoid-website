function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
var levelspawner = {
	blocks : [],
	levelcolumnsnum : 11,
	levelrowsnum : 28,
	collidableblocks : [],
	specialloaded : false,
	normalloaded :false,
	levelindex : getRandomIntInclusive(0,34),
	specialimage : null,
	normalimage : null,
	toprightangle : 0,
	bottomrightangle : 0,
	powerupsperblock : 0.3,
	blockw : null,
	lvlset : null,
	deleteall : function(){
		if(this.blocks[0]){
			this.blocks[0].delete();
			this.deleteall();
		}
	},
	init : function(){
		this.levelcolumnsnum = this.lvlset[0][0].length;
		this.levelrowsnum = this.lvlset[0].length; 
		this.deleteall();
		this.initcollidableblocks();
		console.log("after reset there are: " + this.collidableblocks.length + " collidable blocks out of " + this.blocks.length + " blocks");
		this.makelevel();
	},
	loadimage : function(){
		var specialimg = new Image();
		var normalimg = new Image();
		specialimg.onload = function(){
			
			console.log("special");
			levelspawner.specialloaded = true;
			levelspawner.specialimage = this;
			if(levelspawner.normalloaded){
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
			if(levelspawner.specialloaded){
				console.log("special loaded first")
				//levelspawner.makelevel();
			}
			loadscreen.registerloadedfile();
		}
		console.log("loadimage");
		
		normalimg.src = normalblocksURL;

	},
	initblockangles : function(){
		let columns = this.lvlset[this.levelindex][0].length;
		let rows = this.lvlset[this.levelindex].length;
		let blockwidth = canvas.width / columns;
		let blockheight = canvas.height / rows;
		let m2t = new Vector2(blockwidth/2,0).subtract(new Vector2(blockwidth/2, blockheight/2));
		let m2tr = new Vector2(blockwidth,0).subtract(new Vector2(blockwidth/2, blockheight/2));
		let m2br = new Vector2(blockwidth,blockheight).subtract(new Vector2(blockwidth/2, blockheight/2));
		this.toprightangle = m2t.getUnsignedAngle(m2tr);
		this.bottomrightangle = m2t.getUnsignedAngle(m2br);
	},
	makelevel : function(){
		this.levelcolumnsnum = this.lvlset[0][0].length;
		this.levelrowsnum = this.lvlset[0].length; 
		this.blocks = [];
		let level = this.lvlset[this.levelindex];
		let blockwidth = canvas.width / this.levelcolumnsnum;
		let blockheight = canvas.height / this.levelrowsnum;
		this.blockw = blockwidth;
		let cursor = {x:0, y:0};
		for(var i=0; i < level.length; i++){
			for(var j=0; j < level[i].length; j++){
				let blockindex = level[i][j];
				cursor.x = j*blockwidth;
				cursor.y = i*blockheight;
				if(blockindex > 0){
					let spritecoords;
					if(blockindex != 11){
						spritecoords = this.blockkey[blockindex - 1]();
					}
					else{
						spritecoords = this.blockkey[8]()
					}
					if(blockindex == 9 || blockindex == 10 || blockindex == 11){
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
		this.setpowerups();
		console.log(this.collidableblocks);
		console.log(this.blocks);
		this.initblockangles();
		this.setneighbours();
	},
	setneighbours : function(){
		for(let i=0; i< this.blocks.length; i++){
			let block = this.blocks[i];
			for(let j=0; j< this.blocks.length; j++){
				let iblock = this.blocks[j];
				if((iblock.gridcoords.x == block.gridcoords.x && iblock.gridcoords.y == block.gridcoords.y+1) ||
					(iblock.gridcoords.x == block.gridcoords.x && iblock.gridcoords.y == block.gridcoords.y-1) ||
					(iblock.gridcoords.y == block.gridcoords.y && iblock.gridcoords.x == block.gridcoords.x+1) ||
					(iblock.gridcoords.y == block.gridcoords.y && iblock.gridcoords.x == block.gridcoords.x-1) ||

					(iblock.gridcoords.y == block.gridcoords.y+1 && iblock.gridcoords.x == block.gridcoords.x+1) ||
					(iblock.gridcoords.y == block.gridcoords.y-1 && iblock.gridcoords.x == block.gridcoords.x-1) ||
					(iblock.gridcoords.y == block.gridcoords.y+1 && iblock.gridcoords.x == block.gridcoords.x-1) ||
					(iblock.gridcoords.y == block.gridcoords.y-1 && iblock.gridcoords.x == block.gridcoords.x+1)){

					block.neighbours.push(iblock);
				}
			}
		}
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
			else if(thisx == this.lvlset[this.levelindex][0].length - 1){ // block is on the far right of the row
				neighbours[1] = true;
			}
			else if(thisy == 0){                             // block is at the very top of the column
				neighbours[2] = true;
			}
			else if(thisy == this.lvlset[this.levelindex].length - 1){ // block is at the very bottom of the column
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
		//console.log("no of blocks: " + this.blocks.length);
		//console.log("no collidable: " + this.collidableblocks.length);
	},
	getbreakableblocks : function(){
		let b = [];
		for(let i = 0; i<this.blocks.length; i++){
			if(!this.blocks[i].silver && !this.blocks[i].gold){
				b.push(this.blocks[i]);
			}
			
		}
		return b;
	},
	findvalidindex : function(b, rindexes){

		let r = getRandomIntInclusive(0,b.length-1);
		for(let i=0; i<rindexes.length; i++){
			if(r == rindexes[i]){
				this.findvalidindex(b, rindexes);
			}
		}
		return r;

	},
	setpowerups : function(){
		let b = this.getbreakableblocks();
		console.log("blocks length "+this.blocks.length);
		console.log("b length " + b.length);
		let blockwidth = canvas.width / this.levelcolumnsnum;
		let blockheight = canvas.height / this.levelrowsnum;
		let num = Math.round(b.length*this.powerupsperblock);
		let rindexes = [];
		console.log("num " + num);
		for(let i=0; i<num; i++){
			let completedtypes = [0,1,3,4];
			let typeindex = completedtypes[getRandomIntInclusive(0,completedtypes.length-1)];
			let index = this.findvalidindex(b,rindexes);
			rindexes.push(index);
			let block = b[index];
			let rect = new Rect(new Vector2(block.rect.pos.x, block.rect.pos.y),blockwidth,blockheight);
			let powerup = null;
			switch(typeindex){
				case 3:
					powerup = new StickPowerup(rect,{x : 0, y : typeindex});
					break;
				case 0:
					powerup = new LaserPowerup(rect,{x : 0, y : typeindex});
					break;
				case 1:
					powerup = new LongPowerup(rect,{x : 0, y : typeindex});
					break;
				case 4:
					powerup = new TriBall(rect,{x : 0, y : typeindex});
					break;
				default:
					powerup = new PlaceHolderPowerup(rect,{x : 0, y : typeindex});
			}
			
			block.powerup = powerup;
		}
		
	},
	blockkey : [
		()=>{ return {x:0, y:0};},
		()=>{ return{x:1, y:0};},
		()=>{ return{x:2, y:0};},
		()=>{ return{x:3, y:0};},
		()=>{ return{x:0, y:1};},
		()=>{ return{x:1, y:1};},
		()=>{ return{x:2, y:1};},
		()=>{ return{x:3, y:1};},
		()=>{ return{x:0, y:0};}, //9 - silver
		()=>{ return{x:0, y:1};}  //10 - gold
	]
}
