var txt2sound = (function (module) {

	function TextVoice (sampleRate, frequency, length, attack, release, lfoHz, lfoAmount, waveShape, lfoWaveShape) {
		this.sampleRate		= isNaN(sampleRate) || sampleRate === null ? this.sampleRate : sampleRate;
		this.frequency		= isNaN(frequency) || frequency === null ? this.frequency : frequency;
		this.samplesLeft 	= isNaN(length) || length === null ? this.samplesLeft : length;
		this.osc		    = audioLib.Oscillator(this.sampleRate, this.frequency);
		this.osc.waveShape	= waveShape != undefined ? waveShape : 'sine';
		this.lfoAmount		= isNaN(lfoAmount) || lfoAmount === null ? this.lfoAmount : lfoAmount;
		this.lfoFrequency	= isNaN(lfoHz) || lfoHz === null ? this.lfoFrequency : lfoHz;
		
		var attackValue		= isNaN(attack) || attack === null ? 10 : attack;
		var releaseValue	= isNaN(release) || release === null ? 100 : release;

		this.lfo			= audioLib.Oscillator(this.sampleRate, this.lfoFrequency);
		this.lfo.waveShape	= lfoWaveShape != undefined ? lfoWaveShape : 'sine';
		this.envelope		= audioLib.ADSREnvelope(this.sampleRate);
		this.envelope.attack = attackValue;
		this.envelope.release = this.envelope.releaseTime = releaseValue;
		this.envelope.state = 0;
		
		this.envelope.triggerGate(true);
	}

	TextVoice.prototype = {
	
		released:		false,
		releasePhase:	false,
		sampleRate:		44100,
		frequency:		440,
		sample:			0,
		lfoAmount:  	0,
		lfoFrequency: 	0,
		samplesLeft:	3000,
		mix:			0.5,
		envelope:		null,	
		osc:			null,
		lfo:        	null,

		generate: function () {
			this.sample = 0;
			
			if (this.envelope.state !== 0) {
				this.samplesLeft--;
			}
			
			if (this.samplesLeft <= 0) {
				if (!this.released && this.releasePhase === false) {
					this.releasePhase = true;
					this.envelope.state = 5;					
				}	
			}
			
			this.envelope.generate();
			if (this.envelope.state === 5) {
				this.releasePhase = true;
			}

			if (this.releasePhase && this.envelope.state === 0 && this.released === false) {
				this.released = true;
			} else if (this.released === false) { 
				if (this.frequency !== 0) {
					if (this.lfo.frequency !== 0 && this.lfoAmount !== 0) {
						this.lfo.generate();
						this.osc.fm = this.lfo.getMix() * this.lfoAmount;
					}
					this.osc.generate();
					this.sample = this.osc.getMix() * this.envelope.getMix();
				}
			} 

			return this.sample;
		},
		
		getMix:	function () {
			return this.sample;
		},		
	};

	audioLib.generators('TextVoice', TextVoice);

	return module;
}(txt2sound || {});

