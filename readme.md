# txt2sound.js

txt2sound.js converts text to live audio:

```javascript
txt2sound.setText('this is my text');
txt2sound.play();
txt2sound.stop();
```
txt2sound.js supports a large variety of synthesis and effect controls:

```javascript
// set tempo
txt2sound.settings( { tempo: 120 } );

// set wave shape
txt2sound.settings( { waveShape: 'sine' } );
txt2sound.settings( { waveShape: 'triangle' } );

// set reverb
txt2sound.settings( { reverbWet: .5, reverbDry: .8, reverbSize: .23 } );

// set LFO
txt2sound.settings( { lfoFrequency: 14.5, lfoAmount: .3, lfoWaveShape: 'sawtooth' } );

// set envelope
txt2sound.settings( { attack: 10, release: 100, noteLength: 200 } );
```

## dependencies

txt2sound.js depends on audiolib.js. You can include audiolib.js from the `external` folder in this repository or obtain it directly from https://github.com/jussi-kalliokoski/audiolib.js.


