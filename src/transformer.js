var txt2sound = (function (module) {

	function Transformer (sampleRate, channelCount, tempo, key, octave) {
		this.sampleRate = isNaN(sampleRate) ? 44100 : sampleRate;
		this.octave = isNaN(octave) ? 4 : octave;
		this.key = key === undefined ? 'a' : key;
		
		this.allPitches = this.getAllPitches();
		this.keyPitches = this.getKeyPitches();

		this.beatFactor = this.sampleRate / 60;
		this.setTempo( isNaN(tempo) ? 120 : tempo );
		
		this.reverb = audioLib.Reverb(this.sampleRate, 2, 1, .7, .8, .01);
		
		this.previousChars = new Array(this.previousSize);
		for (var i = 0; i < this.previousSize; i++) {
			this.previousChars[i] = ' ';
		}
	}
	
	Transformer.prototype = {
		sampleRate:		44100,
		position:		-1,
		leftSample:		0,
		rightSample:		0,
		octave:			0,
		key:			'a',
		isMinor:		false,
		tempo:			120,
		allPitches:		[],
		keyPitches:		[],
		samplesLeft:		0,
		beatLength:		0,
		beatFactor:		0,
		text:			'',
		noteDuration:		1.0,
		notesPerBeat:		1,
		voices:			[],
		compressor:		null,
		noteAttack:		10,
		noteLength:		100,
		noteRelease:		500,
		reverb:			null,
		previousSize:		30,
		previousChars:		[],
		currentChar:		'',
		charChanged:		null,
		operator:		0,
		quickNoteOn:		false,
		quickNoteCount:		0,
		quickNoteLimit:		3,
		operatorInterval:	7,
		lfoFrequency:		50,
		lfoAmount:		0,
		waveShape:		'sine',
		lfoWaveShape:		'sine',
		hz:			0,
		sample:			0,
		
		generate: function () {
		
			this.samplesLeft--;

			// if there are no samples left, that means we need
			// to move to the next character and create a new voice.
			if (this.samplesLeft <= 0) {
			
				// reset # of samples left for the note
				this.samplesLeft = this.beatLength;

				// quickNoteOn means a fast note should be played.
				if (this.quickNoteOn) {
					this.samplesLeft = this.samplesLeft / 2;
					this.quickNoteCount++;
					
					if (this.quickNoteCount >= this.quickNoteLimit) {
						this.quickNoteCount = 0;
						this.quickNoteOn = false;
					}
				}

				// change the position we're at in the text. 
				this.incrementPosition();
							
				// get the pitch for the current character in the text
				hz = this.getPitchAtPosition(this.position);

				// if the position didn't equate to a pitch (e.g. it is a special char)
				// then try to generate an operator from the position
				if (hz === 0 && this.operator === 0) {
					this.operator = this.getOperatorAtPosition(this.position);

					// 2 = quick note
					if (this.operator === 2) {
						this.quickNoteOn = true;
						this.incrementPosition();
					}
				
					if (this.operator === 3) {
						this.incrementPosition();
					}
				}


				// add a new voice to the voices array
				this.voices.push( this.getVoice(hz) );


				// did we add a real note?
				if (hz != 0 && this.operator != 0) {
					
					// operator 1 means to play a chord at a given interval
					// operator 3 plays a 3-note chord
					if (this.operator === 1) { 
						hz = hz * Math.pow(module.semitone, this.operatorInterval);
						this.voices.push( this.getVoice(hz) );
					} else if (this.operator === 3) {
						var newhz = hz * Math.pow(module.semitone, this.isMinor ? 3 : 4);
						this.voices.push( this.getVoice(newhz) );
						newhz = hz * Math.pow(module.semitone, 7);
						this.voices.push( this.getVoice(newhz) );
					}
					
					this.operator = 0;
				} 
			}
			
			sample = 0;

			if (this.voices.length > 0){
				// TODO: move var delcaration to earlier in the object
				var current = 0;
				var length = this.voices.length;

				for (current = length - 1; current >= 0; current--) {
										
					this.voices[current].generate();
					sample += this.voices[current].getMix() * .2;
					if (this.voices[current].released === true) {
						this.voices.splice(current, 1);
					}
				}
				
			}
		
			// effects and stereo stuff	
			this.reverb.pushSample(sample, 0);
			this.reverb.pushSample(sample, 1);
			this.leftSample = this.reverb.getMix(0);
			this.rightSample = this.reverb.getMix(1);
		
		},
		
		getVoice: function (frequency) {
			return audioLib.generators.TextVoice(
				this.sampleRate, 
				frequency, 
				this.noteLength + this.noteAttack, 
				this.noteAttack, 
				this.noteRelease, 
				this.lfoFrequency, 
				this.lfoAmount, 
				this.waveShape, 
				this.lfoWaveShape) 
		},
		
		recordPreviousChar: function () {
			this.previousChars.push(this.currentChar);
			this.previousChars.splice(0, 1);
			this.currentChar = this.text[this.position];
			if (this.charChanged != null) {
				this.charChanged();
			}
		},
		
		incrementPosition: function () {
			this.position++;
			if (this.position >= this.text.length) {
				this.position = 0;
			}
			this.recordPreviousChar();			
		},
		
		getMix: function (channel) {
			return channel ? this.leftSample : this.rightSample;
		},
		
		setTempo: function (newTempo) {
			this.tempo = newTempo;
			this.beatLength = Math.floor(this.noteDuration * this.sampleRate * 60 * this.notesPerBeat / newTempo);		
			this.beatMS = this.beatLength / this.sampleRate * 1000;
		},
		
		setText: function (newText) {
			if (this.text.length === 0) {
				this.position = -1;
			}
			this.text = newText.toLowerCase();			
		},
		
		setOctave: function (newOctave) {
			if (newOctave > 0) {
				this.octave = newOctave;
				this.keyPitches = this.getKeyPitches();
			}
		},
		
		setKey: function (newKey) {
			this.key = newKey;
			this.keyPitches = this.getKeyPitches();
		},
		
		getAllPitches: function() {
			var startingHz = 440.0,
				startingNote = -48,
				p, hz,
				newPitches = [];
			for (p = 0; p < 88; p++){
				hz = startingHz * Math.pow(module.semitone, startingNote + p);
				newPitches[p] = hz;
			}
			return newPitches;
		},
		
		getKeyPitches: function () {
		
			var index = 0;
			var notePart = this.key.substr(0, 1).toLowerCase();
			var second = this.key.substr(1, 1).toLowerCase();

			switch(notePart) {
				case 'c': index = 3; break;
				case 'd': index = 5; break;
				case 'e': index = 7; break;
				case 'f': index = 8; break;
				case 'g': index = 10; break;
				case 'a': index = 12; break;
				case 'b': index = 14; break;
			}
			
			var nextStart = 1;
			if (second === '#') {
				index++;
				nextStart = 2;
			} else if (second === 'b') {
				index--;
				nextStart = 2;
			}
			
			var remaining = this.key.substr(nextStart).toLowerCase();
			if (remaining.length === 0) {
				remaining = 'maj';
			}
	
			this.isMinor = remaining === 'min' ? true : false;
			
			switch (remaining) {
				case 'maj': return this.getMajorKeyPitches(index);
				case 'min': return this.getMinorKeyPitches(index);
				default: return this.getMajorKeyPitches(index);
			}
		}, 
		
		getMajorKeyPitches: function (noteIndex) {
			var p = (noteIndex + (this.octave -1) * 12);
			var max = 26; // one for each character
			var stepOffset = 0;
			var count = 0;
			var newPitches = [];
			for (var i = 0; i < max; i++) {
				newPitches.push(this.allPitches[p]);
				if (count === 2 || count === 6 || count === 9 || count === 13 || count === 16 || count === 20 || count === 23 || count === 27) {
					p++;
				} else {
					p += 2;
				}
				count++;
			}
			return newPitches;
		},
		
		getMinorKeyPitches: function (noteIndex) {
			var p = (noteIndex + (this.octave -1) * 12);
			var max = 26; // one for each character
			var stepOffset = 0;
			var count = 0;
			var newPitches = [];
			for (var i = 0; i < max; i++) {
				newPitches.push(this.allPitches[p]);
				if (count === 1 || count === 4 || count === 8 || count === 11 || count === 15 || count === 18 || count === 22 || count === 25) {
					p++;
				} else {
					p += 2;
				}
				count++;
			}
			return newPitches;
		},
		
		changeKey: function (newKey) {
			this.key = newKey;
			this.keyPitches = this.getKeyPitches();
		},
		
		getOperatorAtPosition: function (pos) {
			var partial = this.text.substr(pos, 2);
			
			if (partial === ' #' || partial === '! ') {
				this.quickNoteLimit = 3;
				return 2;
			}
			
			if (partial === ', ' || partial === ' ?') {
				this.quickNoteLimit = 5;
				return 2;
			}

			if (partial === '. ' || partial === ': ') {
				this.quickNoteLimit = 9;
				return 2;
			}

			if (partial === ' (' || partial === ') ') {
				this.quickNoteLimit = 7;
				return 2;
			}

			if (partial === ' @') {
				return 3;
			}

			if (partial[0] === '.') {
				this.quickNoteLimit = 7;
				return 2;
			}

			if (partial[0] === ' ') {
				this.operatorInterval = 7;
				return 1;
			}
			
			if (partial[0] === '/') {
				this.operatorInterval = this.isMinor ? 3 : 4;
				return 1;
			}

			if (partial[0] === '\'') {
				this.operatorInterval = 12;
				return 1;
			}

			return 0;
		},
		
		getPitchAtPosition: function (pos) {
			var code = this.text.charCodeAt(pos) - 97;
			return (code >= 0 && code <= 25) ? this.keyPitches[code] : 0;
		}
	};
	
	audioLib.generators('Transformer', Transformer);
	
	return module;

})(txt2sound || {});
