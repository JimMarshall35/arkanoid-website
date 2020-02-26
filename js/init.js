const normalpaddleURL = 'assets/playerfullsheet.png';
const normalblocksURL = "assets/normalblocks.png";
const specialblocksURL = "assets/specialblocks.png";
const ballURL = 'assets/ball.png';
var canvas = document.getElementById('c');
var drawlist = [[],[],[],[]];
var updatelist = [];
var d = new Date();
var lasttouchpos = null;
function resizeGame() {
    var gameArea = document.getElementById('game-area');
    var widthToHeight = 330/448;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }
    
    //gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    
    var gameCanvas = document.getElementById('c');
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;
}
function handleTouchMove(e){
	let newpos = e.touches[0].pageX;
	let deltaX = newpos - lasttouchpos;
	paddle.move(deltaX)
	// paddle.rect.pos.x += deltaX;
	// if(paddle.rect.pos.x < 0){
	// 	paddle.rect.pos.x = 0;
	// }
	// else if(paddle.rect.pos.x > canvas.width - paddle.rect.w){
	// 	paddle.rect.pos.x = canvas.width - paddle.rect.w;
	// }
	lasttouchpos = newpos;
    e.preventDefault();
}
function handleTouchDown(e){
	lasttouchpos = e.touches[0].pageX;
	e.preventDefault();
}
function handleTouchUp(e){
	gamecontroller.launchball(e);
	e.preventDefault();
}
function disableScroll(){
    document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.body.addEventListener('touchend', handleTouchUp);
    document.body.addEventListener('touchstart', handleTouchDown);
}

disableScroll();
window.addEventListener('resize', resizeGame,false);
window.addEventListener('orientationchange', resizeGame,false);
resizeGame();