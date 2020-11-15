var audio = {
	audioCtx : null,
	sounds : {},
	gain : null,
	panner : null,
	ballsoundnode : null,
	loadsounds : function() {
		var AudioContext = window.AudioContext || window.webkitAudioContext;
		this.audioCtx = new AudioContext();
		this.setupgraph();

		this.loadsound('assets/sfx/bathit.wav', 'bathit');
		this.loadsound('assets/sfx/destroyblock.wav', 'destroyblock');

		this.loadsound('assets/sfx/hitmetalblock.wav', 'hitmetalblock');
		this.loadsound('assets/sfx/die.wav', 'die');
		this.loadsound('assets/sfx/lasershoot.wav', 'lasershoot');
		this.loadsound('assets/sfx/sticktobat.wav', 'sticktobat');
		this.loadsound('assets/sfx/grow.wav', 'grow');

	},
	loadsound : function(url, name){
		let request = new XMLHttpRequest();
		request.open('GET', url , true);
		request.responseType = 'arraybuffer';	
		request.onload = function() {
			let audioData = request.response;
			audio.audioCtx.decodeAudioData(audioData, function(buffer) {
			    audio.sounds[name] = buffer;
			    loadscreen.registerloadedfile();
			},

			function(e){"Error with decoding audio data" + e.err});
		}
		request.send();
	},
	setupgraph : function(){
		this.panner = this.audioCtx.createStereoPanner();
		this.gain = this.audioCtx.createGain();
		this.gain.gain = 0.5;
		this.gain.connect(this.panner);
		this.panner.connect(this.audioCtx.destination);
	},
	play(audiobuffer){
		let node = this.audioCtx.createBufferSource();
		node.buffer = audiobuffer;
		node.onended = function(e){
			this.disconnect();
		}
		if(audiobuffer == this.sounds["bathit"] ||
		   audiobuffer == this.sounds["hitmetalblock"] ||
			audiobuffer == this.sounds["destroyblock"]){
			if(this.ballsoundnode){
				this.ballsoundnode.disconnect();
			}

			this.ballsoundnode = node;
		}
		else{
			console.log("not a ball effect");
		}

		node.connect(audio.gain);
		node.start();
	}
}