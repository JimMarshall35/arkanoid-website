var background = {
	img: null,
	drawlayer : 0,
	gifdims : null,
	generaterandomURL : function(){
		let int = getRandomIntInclusive(1,7);
		return "assets/bg" + int + ".gif";
	},
	loadimage : function(){
		const gif = GIFGroover();
		gif.onload = function(event){
			loadscreen.registerloadedfile();
			this.img = event.gif;
		}	
		gif.src = "https://files.shroomery.org/avatars/shroomery/295380a1376707692-big.gif";
		
	}
}
