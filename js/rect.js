class Rect{
	constructor(pos,w,h){
		this.pos = pos;
		this.w = w;
		this.h = h;
	}
	get bottom() { return (this.pos.y + this.h); }
	get left() { return this.pos.x;}
	get right() { return (this.pos.x + this.w); }
	get top() { return this.pos.y; }
	
	testCollision(rectangle){
		if(this.top > rectangle.bottom || this.right < rectangle.left || this.bottom < rectangle.top || this.left > rectangle.right){
			return false;
		}
		return true;
	}
}