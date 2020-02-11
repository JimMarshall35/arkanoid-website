

if(canvas.getContext){
	var ctx = canvas.getContext('2d');
	paddle.loadimage();
	ball.loadimage();
	levelspawner.loadimage();
}
else{
	console.log("canvas not supported");
}
function updateAll(){
	for(var i=0; i<updatelist.length; i++){
		updatelist[i].update();
	}
}
function drawAll(){
	ctx.beginPath();
	ctx.fillStyle = 'red';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for(var i=0; i<drawlist.length; i++){ // iterate through layers
		for(var j=0; j<drawlist[i].length; j++){ // draw each thing in the layer
			drawlist[i][j].draw();
		}
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
window.requestAnimationFrame(loop);