var selectmenu = {
	levelimages : [],
	levelrects : [],
	startbuttonrect : null,
	scrollpos : 0,
	maxscroll : null,
	scalefactor : null,
	margin : 0.5,
	selectedrect : null,
	buttonimg : null,
	startbuttonanimationframes : [],
	buttonscalar :0.5,
	currentbuttonframe : 0,
	slowdown : 0.95,
	lvlset : null,
	imgwidth : null,
	loadimage : function(){
		var buttonimg = new Image();
		buttonimg.onload = function(){
			selectmenu.buttonimg = this;
			loadscreen.registerloadedfile();
		}
		buttonimg.src = uibuttonURL;
	},
	init : function(){
		this.createLevelImages();
		this.loadbuttonframes();
		this.imgwidth = this.levelimages[0].width *this.scalefactor;
		this.scrollpos =  -this.imgwidth/2;
	},
	loadbuttonframes : function(){
		for(let i=0; i<2; i++){
			let h = this.buttonimg.height/2;
			let w = this.buttonimg.width;
			this.startbuttonanimationframes.push(new Rect(new Vector2(0,i*h),w,h));
		}
	},
	createLevelImages : function(){
		if(this.levelimages.length == 0){
			this.scalefactor = canvas.width/367;
			let blockwidth = 16;
			let blockheight = 8;
			let cursor = {x:0, y:0};
			for(let i=0; i<this.lvlset.length; i++){
				let imgcanvas = document.createElement("canvas");
				imgcanvas.height = origheight;
				imgcanvas.width = origwidth;
				let ctx = imgcanvas.getContext("2d");
				ctx.beginPath();
				ctx.fillStyle = 'green';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				for(let row= 0; row<this.lvlset[i].length; row++){
					for(let column = 0; column < this.lvlset[i][row].length; column++){
						cursor.x = column * blockwidth;
						cursor.y = row * blockheight;
						let blockindex = this.lvlset[i][row][column];
						if(blockindex>0){
							let spritecoords;
							if(blockindex != 11){
								spritecoords = levelspawner.blockkey[blockindex - 1]();
							}
							else{
								spritecoords = levelspawner.blockkey[8]()
							}
							let srect =  new Rect(new Vector2(spritecoords.x*blockwidth, spritecoords.y*blockheight), blockwidth, blockheight);
							let img = null;
							if(blockindex > 8){
								img = levelspawner.specialimage;
							}
							else{
								img = levelspawner.normalimage;
							}
							ctx.drawImage(img, srect.pos.x, srect.pos.y, srect.w, srect.h, cursor.x, cursor.y, blockwidth, blockheight);
						}
					}
				}
				this.levelimages.push(imgcanvas);
				this.levelrects.push({rect: null, number : i});
			}
			this.maxscroll = this.levelimages.length* (this.levelimages[0].width*this.scalefactor + this.levelimages[0].width*this.scalefactor*this.margin);
		}
	},
	draw : function(){
		let totaldistance = 0;
		
		let start = {x:canvas.width/2 +this.scrollpos, y:canvas.height/2 - (this.levelimages[0].height*this.scalefactor)/2};
		for(let i=0; i<this.levelimages.length; i++){

			let x = start.x + i*(this.levelimages[i].width*this.scalefactor + this.levelimages[i].width*this.scalefactor*this.margin);
			let y = start.y;
			let w = this.levelimages[i].width *this.scalefactor;
			let h = this.levelimages[i].height *this.scalefactor;
			if(i == this.selectedrect){
				ctx.fillStyle = 'white';
				ctx.fillRect(x-10,y-10, w+20, h+20);	
			}

			ctx.drawImage(this.levelimages[i], x,y, w, h);
			this.levelrects[i].rect = new Rect(new Vector2(x,y),w,h);
		}
		let w = this.buttonimg.width*this.scalefactor*this.buttonscalar;
		let h = this.buttonimg.height*this.scalefactor*this.buttonscalar;
		let x = (canvas.width/2) -(w/2);
		let y = start.y +this.levelimages[0].height*this.scalefactor + 20; //+(this.levelimages[1].width*this.scalefactor)*this.margin;
		ctx.drawImage(this.buttonimg, this.startbuttonanimationframes[this.currentbuttonframe].pos.x, this.startbuttonanimationframes[this.currentbuttonframe].pos.y,this.startbuttonanimationframes[this.currentbuttonframe].w,this.startbuttonanimationframes[this.currentbuttonframe].h, x,y,w,h);
		this.startbuttonrect = new Rect(new Vector2(x,y),w,h);
		// ctx.fillStyle = 'white';
		// ctx.fillRect(x,y, w, h);	
	},
	update : function(){
		if(!input.mouse){
			if(!input.touchdown){
			this.scrollpos += input.deltaX;
			}
			input.deltaX *= this.slowdown;

			if(this.scrollpos < -this.maxscroll){
	            this.scrollpos = -this.maxscroll;
	        }
	        else if(this.scrollpos > -this.imgwidth/2){
	            this.scrollpos = -this.imgwidth/2;
	        }
		}
		
	}
}
