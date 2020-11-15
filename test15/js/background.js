var background = {
	image : null,
	srects : [],
	index : 0,
	dims : {w:0,h:0}, // the basic unit cell will be set to the size of a single block which has the same aspect ratio as the background tiles (which scale with screen size)
	scalefactor : 3, // the basic rect will be multiplied by this
	columns : 0,
	rows : 0,
	loadimage : function(){
		var bgimage = new Image();
		bgimage.onload = function(){
			loadscreen.registerloadedfile();
			background.image = this;
			//paddle.init(this);
		}
		bgimage.src = bgURL;
	},
	init : function(){
		this.loadsrects();
		this.index = getRandomIntInclusive(0,this.srects.length -1);
		let basicdims = {x:0,y:0};
		basicdims.w = canvas.width / 11;
		basicdims.h = canvas.height / 28;
		this.dims.w = basicdims.w * this.scalefactor;
		this.dims.h = basicdims.h * this.scalefactor;

		this.columns = Math.ceil(canvas.width/this.dims.w);
		this.rows = Math.ceil(canvas.height/this.dims.h);
		//this.loadsrects();
	},
	loadsrects : function(){
		let w = 64;
		let h = 32;
		let cursor = {x:0, y: this.image.height}
		for(let i=0; i<5; i++){
			cursor.y -= h;
			this.srects.push(new Rect(new Vector2(cursor.x, cursor.y), w,h));

		}
	},
	drawbackground : function(){
		let srect = this.srects[this.index];
		for(let row=0; row<this.rows; row++){
			for(let col=0; col<this.columns; col++){
				ctx.drawImage(this.image, srect.pos.x,srect.pos.y,srect.w,srect.h, Math.floor(this.dims.w*col), Math.floor(this.dims.h * row), Math.ceil(this.dims.w),Math.ceil(this.dims.h));
			}
		}

	}
}
