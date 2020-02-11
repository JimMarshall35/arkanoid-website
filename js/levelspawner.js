var levelspawner = {
	blocks : [],
	specialloaded : false,
	normalloaded :false,
	levelindex : 0,
	specialimage : null,
	normalimage : null,

	loadimage : function(){
		var specialimg = new Image();
		var normalimg = new Image();
		specialimg.onload = function(){
			console.log("special");
			levelspawner.specialloaded = true;
			levelspawner.specialimage = this;
			if(levelspawner.normalloaded){
				console.log("special loaded first")
				levelspawner.makelevel();
			}
		}
		specialimg.src = specialblocksURL;
		normalimg.onload = function(){
			console.log("normal");
			levelspawner.normalloaded = true;
			levelspawner.normalimage = this;
			if(levelspawner.specialloaded){
				console.log("special loaded first")
				levelspawner.makelevel();
			}
		}
		console.log("loadimage");
		
		normalimg.src = normalblocksURL;

	},
	makelevel : function(){
		let level = levels.NES[this.levelindex];
		let blockwidth = canvas.width / 11;
		let blockheight = canvas.height / 28;
		let cursor = {x:0, y:0};
		for(var i=0; i < level.length; i++){
			for(var j=0; j < level[i].length; j++){
				let blockindex = level[i][j];
				cursor.x = j*blockwidth;
				cursor.y = i*blockheight;
				if(blockindex > 0){
					let spritecoords = this.blockkey[blockindex - 1];
					if(blockindex == 9 || blockindex == 10){
						let block = new SpecialBlock(new Rect(new Vector2(cursor.x,cursor.y),blockwidth,blockheight), spritecoords, this.specialimage);
						this.blocks.push(block);
					}
					else{
						this.blocks.push(new Block(new Rect(new Vector2(cursor.x,cursor.y),blockwidth,blockheight), spritecoords, this.normalimage));
					}
					
				}
			}
		}
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
