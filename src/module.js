var txt2sound = (function (module) {

	var device,
		playing		= false,
		initialOctave	= 2,
		initialTempo	= 240,
		initialKey 	= 'D',
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
	transformer = audioLib.generators.Transformer(
		device.sampleRate, module.channels, initialTempo, initialKey, initialOctave);
	
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

	module.setTempo = function (newTempo) {
		transformer.setTempo(newTempo);
	};

	module.getTempo = function () {
		return transformer.tempo;
	};

	module.setOctave = function (newOctave) {
		transformer.setOctave(newOctave);
	};

	module.getOctave = function () {
		return transformer.octave;
	};

	module.setReverbWet = function (wet) {
		transformer.reverb.wet = wet;
	};

	module.getReverbWet = function () {
		return transformer.reverb.wet;
	};

	module.setReverbDry = function (dry) {
		transformer.reverb.dry = dry;
	};

	module.getReverbDry = function () {
		return transformer.reverb.dry; 
	};

	module.setReverbSize = function (size) {
		transformer.reverb = audioLib.Reverb(device.sampleRate,
			module.channels, transformer.reverb.wet, transformer.reverb.dry,
			size, transformer.reverb.damping);
	};

	module.getReverbSize = function () {
		return transformer.reverb.roomSize;
	};

	module.setWaveShape = function (newShape) {
		transformer.waveShape = newShape;
	};

	module.getWaveShape = function () {
		return transformer.waveShape;
	};

	module.setLfoFrequency = function (newHz) {
		transformer.lfoFrequency = newHz;
	};

	module.getLfoFrequency = function () {
		return transformer.lfoFrequency; 
	};

	module.setLfoAmount = function (newAmount) {
		transformer.lfoAmount = newAmount;
	};

	module.getLfoAmount = function () {
		return transformer.lfoAmount;
	};	

	module.setLfoWaveShape = function (newShape) {
		transformer.lfoWaveShape = newShape;
	};

	module.getLfoWaveShape = function () {
		return transformer.lfoWaveShape;
	};

	module.setAttack = function (attackValue) {
		transformer.noteAttack = attackValue; 
	};

	module.getAttack = function () {
		return transformer.noteAttack;
	};

	module.setRelease = function (releaseValue) {
		transformer.noteRelease = releaseValue; 
	};

	module.getRelease = function () {
		return transformer.noteRelease; 
	};

	module.setNoteLength = function (lengthValue) {
		transformer.noteLength = lengthValue;
	};

	module.getNoteLength = function () {
		return transformer.noteLength;
	};

	return module;

})(txt2sound || {});
