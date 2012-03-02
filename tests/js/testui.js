(function () {

	var playing = false;
		
	var textInputKeyup = function () {
		txt2sound.setText($('#textInput').val());
	};
	
	var setPlayButtonText = function (newText) {
		$('#playButton').text(newText);
	};

	var playButtonClick = function () {
		if (!playing) {
			txt2sound.play();
			setPlayButtonText('Stop');
		} else {
			txt2sound.stop();
			setPlayButtonText('Play');
		}
		playing = !playing;
	};
	
		
	$(document).ready(function (){
	
		$('#playButton').click(playButtonClick);
		$('#textInput').live('keyup', textInputKeyup);
		textInputKeyup();
		
		$('#lfoHzSlider').slider( {
			min: 0,
			max: 200,
			step: .1,
			value: txt2sound.transformer.lfoFrequency,
			change: function (event, ui) { txt2sound.settings( {lfoFrequency: ui.value}); },
			slide: function (event, ui) { txt2sound.settings( {lfoFrequency: ui.value}); }
		});
		
		$('#lfoAmountSlider').slider( {
			min: 0,
			max: 1,
			step: .01,
			value: txt2sound.transformer.lfoAmount,
			change: function (event, ui) { txt2sound.transformer.lfoAmount = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.lfoAmount = ui.value; }
		});
		
		$('#waveShapeSelect').change(function () {
			txt2sound.transformer.waveShape = $('#waveShapeSelect').val();
		});

		$('#lfoWaveShapeSelect').change(function () {
			txt2sound.transformer.lfoWaveShape = $('#lfoWaveShapeSelect').val();
		});

		$('#octaveSlider').slider({
			min: 0,
			max: 6,
			value: txt2sound.transformer.octave,
			step: 1,
			change: function (event, ui) { txt2sound.transformer.setOctave(ui.value); },
			slide: function (event, ui) { txt2sound.transformer.setOctave(ui.value); } 
		});

		$('#reverbDrySlider').slider({
			min: 0,
			max: 1,
			value: txt2sound.transformer.reverb.dry,
			step: .01,
			change: function (event, ui) { txt2sound.transformer.reverb.dry = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.reverb.dry = ui.value; } 
		});

		$('#reverbWetSlider').slider({
			min: 0,
			max: 1,
			value: txt2sound.transformer.reverb.wet,
			step: .01,
			change: function (event, ui) { txt2sound.transformer.reverb.wet = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.reverb.wet = ui.value; } 
		});

		$('#reverbSizeSlider').slider({
			min: 0,
			max: 1,
			value: txt2sound.transformer.reverb.roomSize,
			step: .01,
			change: function (event, ui) { txt2sound.changeReverbSize(ui.value); }
		});

		$('#noteLengthSlider').slider({
			min: 50,
			max: 10000,
			value: txt2sound.transformer.noteLength,
			step: 1,
			change: function (event, ui) { txt2sound.transformer.noteLength = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.noteLength = ui.value; } 
		});

		$('#attackSlider').slider({
			min: 1,
			max: 1000,
			value: txt2sound.transformer.noteAttack,
			step: 1,
			change: function (event, ui) { txt2sound.transformer.noteAttack = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.noteAttack = ui.value; } 
		});
		
		$('#releaseSlider').slider({
			min: 1,
			max: 1000,
			value: txt2sound.transformer.noteRelease,
			step: 1,
			change: function (event, ui) { txt2sound.transformer.noteRelease = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.noteRelease = ui.value; } 
		});

		$('#tempoSlider').slider({
			min: 40,
			max: 1000,
			value: txt2sound.transformer.tempo,
			step: 1,
			change: function (event, ui) { txt2sound.transformer.setTempo(ui.value); },
			slide: function (event, ui) { txt2sound.transformer.setTempo(ui.value); } 
		});
	
	
	});
	

})();
