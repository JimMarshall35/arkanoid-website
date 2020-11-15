function debug(){


    let text = "innerwidth "+window.innerWidth + ", innerHeight "+ window.innerHeight
    let info = sliderctx.measureText(text);


    sliderctx.font = "20px digital7";
    sliderctx.strokeText(text, (sliderc.width/2) - info.width/2, (sliderc.height/3)*2 - (20/2) );
	sliderctx.stroke();
}

if(canvas.getContext){
	var ctx = canvas.getContext('2d');
	var scorectx = scorec.getContext('2d');
	var sliderctx = sliderc.getContext('2d');
	loadImages();
}
else{
	console.log("canvas not supported");
}
function loadImages(){
	loadscreen.firstscene = scene.scenes.chooseLevelSet;
	loadscreen.callback = scene.changescene;
	paddle.loadimage();
	ballcontroller.loadimage();
	levelspawner.loadimage();
	powerupcontroller.loadimage();
	selectmenu.loadimage();
	background.loadimage();
	gamecontroller.loadimage();
	audio.loadsounds();
}



// function drawdebugpanel(){
	
// }
function drawAll(){}
function updateAll(){}
loop = function(){
	d = new Date();
	if(loadscreen.finished && scene.currentscene != null){
		updateAll();
		drawAll();
	}
	else{
		loadscreen.drawloadscreen();
	}
	window.requestAnimationFrame(loop);

}


window.requestAnimationFrame(loop);
