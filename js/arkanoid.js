const normalpaddleURL = 'assets/normalbats.png';
const ballURL = 'assets/ball.png';
var canvas = document.getElementById('c');
var drawlist = [];
var d = new Date();


if(canvas.getContext){
	var ctx = canvas.getContext('2d');
	paddle.loadimage();
	ball.loadimage();
}
else{
	console.log("canvas not supported");
}
function drawAll(){
	ctx.beginPath();
	ctx.fillStyle = 'red';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for(var i=0; i<drawlist.length; i++){
		drawlist[i].draw();
	}
}
loop = function(){
	d = new Date();
	paddle.setspritecoords();
	drawAll();
	window.requestAnimationFrame(loop);
	//console.log('new frame');
}
document.body.addEventListener('mousemove', e => {
	paddle.rect.x += e.movementX;
	if(paddle.rect.x < 0){
		paddle.rect.x = 0;
	}
	else if(paddle.rect.x > canvas.width - paddle.rect.w){
		paddle.rect.x = canvas.width - paddle.rect.w;
	}
});
window.requestAnimationFrame(loop);