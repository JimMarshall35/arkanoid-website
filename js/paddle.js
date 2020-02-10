var paddle = {
	flashspeed : 150, // number of milliseconds between animation frames
	scalefactor: 2,
	animationtimer : d.getTime(),
	img : null,
	rect : new Rect(new Vector2(canvas.width/2,canvas.height - 20), 0,0),
	spritecoords : {
		x : 0,
		y : 0
	},
	draw : function(){
		var swidth = this.img.width / 4;
		var sheight = this.img.height / 4;
		var sx = this.spritecoords.x * swidth;
		var sy = this.spritecoords.y * sheight;
		ctx.drawImage(this.img, sx, sy, swidth, sheight, this.rect.pos.x, this.rect.pos.y, this.rect.w, this.rect.h);
	},
	loadimage : function(){
		var normalpaddleimg = new Image();
		normalpaddleimg.onload = function(){
			paddle.img = this;
			paddle.rect.w = (this.width/4) * paddle.scalefactor;
			paddle.rect.h = (this.height/4)* paddle.scalefactor;
			drawlist[1].push(paddle);
			updatelist.push(paddle);
		}
		normalpaddleimg.src = normalpaddleURL;
	},
	update(){
		
		let time = d.getTime() - this.animationtimer;
		if(time >= this.flashspeed){
			this.spritecoords.y++;
			this.animationtimer = d.getTime();
			if(this.spritecoords.y > 3){
				this.spritecoords.y = 0;
				this.spritecoords.x++;
				if(this.spritecoords.x > 3){
					this.spritecoords.x = 0;
				}
			}
		}
	},
	move(deltaX){
		this.rect.pos.x += deltaX;
		if(this.rect.pos.x < 0){
			this.rect.pos.x = 0;
		}
		else if(this.rect.pos.x > canvas.width - this.rect.w){
			this.rect.pos.x = canvas.width - this.rect.w;
		}
	}
}