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

	static testCollision(r1,r2)
	{
		if (r1.pos.x < r2.pos.x + r2.w && r1.pos.x + r1.w > r2.pos.x)
		{
			if (r1.pos.y < r2.pos.y + r2.h && r1.pos.y + r1.h > r2.pos.y)
			{
				return true;
			}
		}
		return false;
	}
	static isPointInRect(p,r){
		if(p.x <r.pos.x + r.w && p.x >r.pos.x){
			if(p.y <r.pos.y + r.h && p.y > r.pos.y){
				return true;
			}
		}
		return false;
	}
}