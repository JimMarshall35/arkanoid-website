var background = {
	img: null,
	drawlayer : 0,
	generaterandomURL : function(){
		let int = getRandomIntInclusive(1,7);
		return "assets/bg" + int + ".gif";
	},
	loadimage : function(){
		//let url = this.generaterandomURL();
		//console.log(url);
		var bgimg = gifler("https://files.shroomery.org/avatars/shroomery/295380a1376707692-big.gif").frames("canvas", this.ondrawframe);
		bgimg.onload = function(){
			background.init(this);
			console.log("bg loaded");
		}
	},
	init : function(img){
		this.img = img;
	},
	ondrawframe(){
	}
}
