var LevelSpawner = {
	blocks : [],
	level : [],
	specialimage : null,
	normalimage : null,
	normalblocksURL : "../js/normalblocks.png",
	specialblocksURL : "../js/specialblocks.png",
	loadimage : function(){
		var specialimg = new Image();
		var normalimg = new Image();
		specialimg.onload = function(){
			LevelSpawner.specialimage = this;
		}
		normalimg.onload = function(){
			LevelSpawner.normalimage = this;
		}
		specialimg.src = this.specialblocksURL;
		normalimg.src = this.normalblocksURL;
	},
	makelevel : function(){
		
	},
	drawblocks : function(){
		for(var i=0; i < blocks.length; i++){
			blocks[i].draw();
		}
	},
	blockkeynormal : {
		1 : {x:0, y:0},
		2 : {x:1, y:0},
		3 : {x:2, y:0},
		4 : {x:3, y:0},
		5 : {x:0, y:1},
		6 : {x:1, y:1},
		7 : {x:2, y:1},
		8 : {x:3, y:1}
	}
}
