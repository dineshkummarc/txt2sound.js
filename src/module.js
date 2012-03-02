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
	
	module.changeReverbSize = function (newSize) {
		transformer.reverb = audioLib.Reverb(device.sampleRate, channels, transformer.reverb.wet, transformer.reverb.dry, newSize, transformer.reverb.damping);
	};
		
	return module;

})(txt2sound || {});
