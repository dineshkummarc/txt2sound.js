var txt2sound = (function (module) {

	var device,
		playing			= false,
		initialOctave	= 2,
		initialTempo	= 240,
		initialKey 		= 'D',
		transformer;		

	var audioCallback =  function (buffer, channelCount) {	
		if (playing) {
			var channel;			
			for (var i = 0; i < buffer.length; i+=channelCount) {
				transformer.generate();
				for (channel = 0; channel < channelCount; channel++) {
					buffer[i + channel] = transformer.getMix(channel);
				}
			}
		}
	};
	
	device = audioLib.AudioDevice(audioCallback, module.channels);
	transformer = audioLib.generators.Transformer(device.sampleRate, module.channels, initialTempo, initialKey, initialOctave);
	
	module.transformer = transformer;
	
	module.play = function () {
		if (!playing) {
			playing = true;
		}
	};
	
	module.stop = function () {
		if (playing) {
			playing = false;
		}
	};
	
	module.setText = function (inputText) {
		transformer.setText(inputText);
	};
	
	module.getPreviousChars = function () {
		return transformer.previousChars;
	};
	
	module.getNextChars = function () {
		return transformer.nextChars;
	};
	
	module.getCurrentChar = function () {
		return transformer.currentChar;
	};
	
	module.charChanged = function (callback) {
		transformer.charChanged = callback;
	};

	module.settings = function (settings) {

		if (!isNaN(settings.tempo)) {
			transformer.setTempo(settings.tempo);
		}

		if (!isNaN(settings.octave)) {
			transformer.setOctave(settings.octave);
		}

		if (!isNaN(settings.reverbWet)) {
			transformer.reverb.wet = settings.reverbWet;
		}

		if (!isNaN(settings.reverbDry)) {
			transformer.reverb.dry = settings.reverbDry;
		}

		if (!isNaN(settings.reverbSize)) {
			transformer.reverb = audioLib.Reverb(device.sampleRate,
				module.channels, transformer.reverb.wet, transformer.reverb.dry,
				settings.reverbSize, transformer.reverb.damping);
		}

		if (settings.waveShape != undefined) {
			transformer.waveShape = settings.waveShape;
		}

		if (!isNaN(settings.lfoFrequency)) {
			transformer.lfoFrequency = settings.lfoFrequency; 
		}

		if (!isNaN(settings.lfoAmount)) {
			transformer.lfoAmount = settings.lfoAmount;
		}

		if (settings.lfoWaveShape != undefined) {
			transformer.lfoWaveShape = settings.lfoWaveShape;
		}

		if (!isNaN(settings.attack)) {
			transformer.noteAttack = settings.attack;
		}

		if (!isNaN(settings.release)) {
			transformer.noteRelease = settings.release;
		}

		if (!isNaN(settings.noteLength)) {
			transformer.noteLength = settings.noteLength;
		}

	};

		
	return module;

})(txt2sound || {});
