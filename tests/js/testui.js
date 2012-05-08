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
			value: txt2sound.getLfoFrequency(),
			change: function (event, ui) { txt2sound.setLfoFrequency( ui.value ); },
			slide: function (event, ui) { txt2sound.setLfoFrequency (ui.value ); }
		});
		
		$('#lfoAmountSlider').slider( {
			min: 0,
			max: 1,
			step: .01,
			value: txt2sound.getLfoAmount(),
			change: function (event, ui) { txt2sound.setLfoAmount(ui.value); },
			slide: function (event, ui) { txt2sound.setLfoAmount(ui.value); }
		});
		
		$('#waveShapeSelect').change(function () {
			txt2sound.setWaveShape ( $('#waveShapeSelect').val() );
		});

		$('#lfoWaveShapeSelect').change(function () {
			txt2sound.setLfoWaveShape( $('#lfoWaveShapeSelect').val() );
		});

		$('#octaveSlider').slider({
			min: 0,
			max: 6,
			value: txt2sound.getOctave(),
			step: 1,
			change: function (event, ui) { txt2sound.setOctave(ui.value); },
			slide: function (event, ui) { txt2sound.setOctave(ui.value); }
		});

		$('#reverbDrySlider').slider({
			min: 0,
			max: 1,
			value: txt2sound.getReverbDry(),
			step: .01,
			change: function (event, ui) { txt2sound.setReverbDry(ui.value); },
			slide: function (event, ui) { txt2sound.setReverbDry(ui.value); }
		});

		$('#reverbWetSlider').slider({
			min: 0,
			max: 1,
			value: txt2sound.getReverbWet(),
			step: .01,
			change: function (event, ui) { txt2sound.setReverbWet(ui.value); },
			slide: function (event, ui) { txt2sound.setReverbWet(ui.value); } 
		});

		$('#reverbSizeSlider').slider({
			min: 0,
			max: 1,
			value: txt2sound.getReverbSize(),
			step: .01,
			change: function (event, ui) { txt2sound.setReverbSize(ui.value); }
		});

		$('#noteLengthSlider').slider({
			min: 50,
			max: 10000,
			value: txt2sound.getNoteLength(),
			step: 1,
			change: function (event, ui) { txt2sound.setNoteLength (ui.value); },
			slide: function (event, ui) { txt2sound.setNoteLength (ui.value); } 
		});

		$('#attackSlider').slider({
			min: 1,
			max: 1000,
			value: txt2sound.getAttack(),
			step: 1,
			change: function (event, ui) { txt2sound.setAttack (ui.value); },
			slide: function (event, ui) { txt2sound.setAttack (ui.value); } 
		});
		
		$('#releaseSlider').slider({
			min: 1,
			max: 1000,
			value: txt2sound.getRelease(),
			step: 1,
			change: function (event, ui) { txt2sound.setRelease(ui.value); },
			slide: function (event, ui) { txt2sound.setRelease(ui.value); } 
		});

		$('#tempoSlider').slider({
			min: 40,
			max: 1000,
			value: txt2sound.getTempo(),
			step: 1,
			change: function (event, ui) { txt2sound.setTempo(ui.value); },
			slide: function (event, ui) { txt2sound.setTempo(ui.value); } 
		});
	
	
	});
	

})();
