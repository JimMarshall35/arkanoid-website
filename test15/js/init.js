const normalpaddleURL = 'assets/playerfullsheet.png';
const normalblocksURL = "assets/normalblocks.png";
const specialblocksURL = "assets/specialblocks.png";
const powerupURL = "assets/powerups.png";
const ballURL = 'assets/ball.png';
const uibuttonURL = 'assets/button.png';
const bgURL = 'assets/bg.png';
const backbuttonURL = 'assets/backbutton.png';
var canvas = document.getElementById('c');
var scorec = document.getElementById('score');
var sliderc = document.getElementById('slider');

var d = new Date();
var origwidth = 176;
var origheight = 224;
function resizeGame() {
    var gameArea = document.getElementById('game-area');
    var slider = document.getElementById('slider');
    var widthToHeight = origwidth/origheight;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    if (newWidthToHeight > widthToHeight) {     // if "landscape" window
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
        gameArea.style.marginTop = (-newHeight / 2) + 'px';
        gameArea.style.marginLeft = (-newWidth / 2) + 'px';
        slider.style.width = 0 + "px";
        slider.style.height = 0 + "px";
        
    } else {                                  
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
        gameArea.style.marginTop = ((-newHeight / 2) - (window.innerHeight - newHeight)/2)+ 'px';
        gameArea.style.marginLeft = (-newWidth / 2) + 'px';
        slider.style.width =  newWidth + 'px';
        slider.style.height = window.innerHeight - newHeight + 'px';

        slider.style.marginTop = ((newHeight / 2) - (window.innerHeight - newHeight)/2)+ 'px';
        slider.style.marginLeft = (-newWidth / 2) + 'px';
    }
    var gameCanvas = document.getElementById('c');
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;
}
window.onload = resizeGame;
window.addEventListener('resize', resizeGame,false);
window.addEventListener('orientationchange', resizeGame,false);




