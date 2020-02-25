var loadscreen = {
	filestoload : 4,
	filesloaded : 0,
	finished : false,
	margin : 50,
	height : 20,
	registerloadedfile : function(){
		
		this.filesloaded++;
		console.log("files loaded "+this.filesloaded);
		if(this.filesloaded == this.filestoload){
			//levelspawner.makelevel();
			this.finished = true;
		}
		console.log("finished: " + this.finished);

	},
	drawloadscreen : function(){
		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'blue';
		ctx.fillRect(this.margin, (canvas.height/2)+0.5*this.height, canvas.width - (2*this.margin), this.height);
		ctx.fillStyle = 'green';
		ctx.fillRect(this.margin, (canvas.height/2)+0.5*this.height, (canvas.width - (2*this.margin))*(this.filesloaded/this.filestoload), this.height);
	}
}
