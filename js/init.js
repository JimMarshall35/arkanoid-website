const normalpaddleURL = 'assets/playerfullsheet.png';
const normalblocksURL = "assets/normalblocks.png";
const specialblocksURL = "assets/specialblocks.png";
const powerupURL = "assets/powerups.png";
const ballURL = 'assets/ball.png';
var canvas = document.getElementById('c');
var drawlist = [[],[],[]];
var updatelist = [];
var d = new Date();

// function resizeGame(){
// 	var gamearea = document.getElementById("game-area");
// 	var widthtoheight = 330/448;
// 	var newwidth = window.innerWidth;
// 	var newheight = window.innerHeight;
// 	var newwidthtoheight = newwidth/newheight;
// 	if(newwidthtoheight > widthtoheight){
// 		newwidth = newheight*widthtoheight;
// 		gamearea.style.width = newwidth + 'px';
// 		gamearea.style.height = newheight + 'px';
// 	}
// 	else{
// 		newheight = newwidth/widthtoheight;
// 		gamearea.style.width = newwidth + 'px';
// 		gamearea.style.height = newheight + 'px';
// 	}
// 	gamearea.style.marginTop = (-newheight/2) +'px';
// 	gamearea.style.marginLeft = (-newwidth/2) +'px';
// 	var gamecanvas = document.getElementById('c');
// 	gamecanvas.width = newwidth;
// 	gamecanvas.height = newheight;
// }
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
window.addEventListener('resize', resizeGame,false);
window.addEventListener('orientationchange', resizeGame,false);
resizeGame();