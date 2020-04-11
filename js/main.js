

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
	paddle.loadimage();
	ball.loadimage();
	levelspawner.loadimage();
	//background.loadimage();
	powerupcontroller.loadimage();
}
function updateAll(){
	for(var i=0; i<updatelist.length; i++){
		updatelist[i].update();
	}
}
function drawAll(){
	if(loadscreen.finished){
		
		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		scorectx.fillStyle = 'green';
		scorectx.fillRect(0,0, scorec.width,scorec.height);
		sliderctx.fillStyle = 'green';
		sliderctx.fillRect(0,0, sliderc.width,scorec.height);
		for(var i=0; i<drawlist.length; i++){ // iterate through layers
			for(var j=0; j<drawlist[i].length; j++){ // draw each thing in the layer
				drawlist[i][j].draw();
			}
		}
	}
	else{
		loadscreen.drawloadscreen();
	}
}
loop = function(){
	d = new Date();
	updateAll();
	drawAll();
	window.requestAnimationFrame(loop);

}
document.body.addEventListener('mousemove', e => {
	paddle.move(e.movementX);
});
document.body.addEventListener('click', gamecontroller.launchball);
document.addEventListener('keydown', function(e){
	if(e.code == "KeyS" && paddle.state == paddle.transitions.normal){
		paddle.state.transition2laser();
	}
	if(e.code == "KeyS" && paddle.state == paddle.transitions.laser){
		paddle.state.transitionfromlaser();
	}
	if(e.code == "KeyA" && paddle.state == paddle.transitions.laser){
		paddle.shoot();
		//console.log(paddle.projectiles.length);
	}

});
window.requestAnimationFrame(loop);
