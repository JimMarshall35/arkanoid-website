var input = {
	touchuplistener : null,
	touchdownlistener : null,
	touchmovelistener : null,
	clicklistener : null,
	mousemovelistener : null,
	mouseuplistener : null,
	mousedownlistener : null,

	lasttouchpos : null,
	lasttouch : null,
	touchdown : false,
	deltaX : 0,

	mouse : false,
	up : null,
	down : null,
	move : null,
	mmove : null,
	click : null,
	mousedown : null,
	mouseup : null,
	getcanvasrelative : function(e){
		//const canvas = e.target;
		const bx = canvas.getBoundingClientRect();
		const x = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) - bx.left;
		const y = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - bx.top;
		return {
			x: x,
			y: y
		};
	},
	setnewinputlisteners : function(up, down, move, mousemove, click, mousedown, mouseup){
		this.up = up;
		this.down = down;
		this.move = move;
		this.mmove = mousemove;
		this.click = click;
		this.mousedown = mousedown;
		this.mouseup = mouseup;
		if(this.touchuplistener != null){
			document.body.removeEventListener("touchend", this.touchuplistener);
		}
		if(this.touchdownlistener != null){
			document.body.removeEventListener("touchstart", this.touchdownlistener);
		}
		if(this.touchmovelistener != null){
			document.body.removeEventListener("touchmove", this.touchmovelistener, { passive: false });
		}

		if(this.clicklistener != null){
			document.body.removeEventListener("click", this.clicklistener);
		}
		if(this.mousemovelistener != null){
			document.body.removeEventListener("mousemove", this.mousemovelistener);
		}
		if(this.mouseuplistener != null){
			document.body.removeEventListener("mouseup", this.mouseuplistener);
		}
		if(this.mousedownlistener != null){
			document.body.removeEventListener("mousdown", this.mousedownlistener);
		}
		this.touchuplistener = function(e){
			input.setstatevarsonup(e);
			input.up(e);
			e.preventDefault();
		}
		this.touchdownlistener = function(e){
			input.setstatevarsondown(e);
			input.down(e);
			e.preventDefault();
		}
		this.touchmovelistener = function(e){
			input.setstatevarsonmove(e);
			input.move(e);
			e.preventDefault();
		}
		document.body.addEventListener('touchmove', this.touchmovelistener, { passive: false });
    	document.body.addEventListener('touchend', this.touchuplistener);
    	document.body.addEventListener('touchstart', this.touchdownlistener);

    	this.mousemovelistener = function(e){
			input.setstatevarsonmove(e);
			input.mmove(e);
			e.preventDefault();
		}
		this.clicklistener = function(e){
			input.mouse = true;
			input.click(e);
			e.preventDefault();
		}
		this.mouseuplistener = function(e){
			input.setstatevarsonup(e);
			input.mouseup(e);
			e.preventDefault();
		}
		this.mousedownlistener = function(e){
			input.setstatevarsondown(e);
			input.mousedown(e);
			e.preventDefault();
		}
    	document.body.addEventListener('click', this.clicklistener);
    	document.body.addEventListener('mousemove', this.mousemovelistener);
    	document.body.addEventListener('mouseup', this.mouseuplistener);
    	document.body.addEventListener('mousedown', this.mousedownlistener);
	},
	setstatevarsonmove : function(e){
		let newpos;
		if(e.touches){
			newpos = e.touches[0].pageX;
	    	this.lasttouch = e.touches[0];
		}
		else if(e.pageX){
			newpos = e.pageX;
	    	this.lasttouch = e;
		}
	    
	    this.deltaX = newpos - this.lasttouchpos;
	    this.lasttouchpos = newpos;
	}, 
	setstatevarsondown : function(e){
		this.touchdown = true;
		if(e.touches){
			this.lasttouchpos = e.touches[0].pageX;
    		this.lasttouch = e.touches[0];
		}
		else if(e.pageX){
			this.lasttouchpos = e.pageX;
    		this.lasttouch = e;
		}
		
	},
	setstatevarsonup : function(e){
		this.touchdown = false;
	}
};