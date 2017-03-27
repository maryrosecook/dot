;(function(exports) {
  function Synthesiser() {
    this.audio = new AudioContext();

    var snare = new Snare(this.audio);
    this.snare = function() {
      snare.trigger(new Date().getTime());
    };
  };

  Synthesiser.prototype = {
    note: function(frequency) {
      var duration = 1;
      var sineWave = createSineWave(this.audio, duration);
      sineWave.frequency.value = frequency;
      chain([
        sineWave,
        createAmplifier(this.audio, 0.2, duration),
        this.audio.destination
      ]);
    }
  };

  function noiseBuffer() {
	  var bufferSize = this.context.sampleRate;
	  var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
	  var output = buffer.getChannelData(0);

	  for (var i = 0; i < bufferSize; i++) {
		  output[i] = Math.random() * 2 - 1;
	  }

	  return buffer;
  };

  function setupNoise(audio) {
    var noise = audio.createBufferSource();
	  noise.buffer = noiseBuffer();
	  var noiseFilter = audio.createBiquadFilter();
	  noiseFilter.type = 'highpass';
	  noiseFilter.frequency.value = 1000;
	  noise.connect(noiseFilter);

    var noiseEnvelope = this.context.createGain();
    noiseFilter.connect(noiseEnvelope);

    noiseEnvelope.connect(audio.destination);

    var osc = audio.createOscillator();
    osc.type = 'triangle';

    var oscEnvelope = audio.createGain();
    osc.connect(oscEnvelope);
    oscEnvelope.connect(audio.destination);
  };

  function createSineWave(audio, duration) {
    var oscillator = audio.createOscillator();
    oscillator.type = "sine";
    oscillator.start(audio.currentTime);
    oscillator.stop(audio.currentTime + duration);
    return oscillator;
  };

  function createAmplifier(audio, startValue, duration) {
    var amplifier = audio.createGain();
    rampDown(audio, amplifier.gain, startValue, duration);
    return amplifier;
  };

  function rampDown(audio, value, startValue, duration) {
    value.setValueAtTime(startValue, audio.currentTime);
    value.exponentialRampToValueAtTime(0.01, audio.currentTime + duration);
  };

  function chain(soundNodes) {
    for (var i = 0; i < soundNodes.length - 1; i++) {
      soundNodes[i].connect(soundNodes[i + 1]);
    }
  };

  function Snare(context) {
    this.context = context;
  };

  Snare.prototype.setup = function() {
    this.noise = this.context.createBufferSource();
    this.noise.buffer = this.noiseBuffer();

    var noiseFilter = this.context.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    this.noise.connect(noiseFilter);

    this.noiseEnvelope = this.context.createGain();
    noiseFilter.connect(this.noiseEnvelope);

    this.noiseEnvelope.connect(this.context.destination);

    this.osc = this.context.createOscillator();
    this.osc.type = 'triangle';

    this.oscEnvelope = this.context.createGain();
    this.osc.connect(this.oscEnvelope);
    this.oscEnvelope.connect(this.context.destination);
  };

  Snare.prototype.noiseBuffer = function() {
    var bufferSize = this.context.sampleRate;
    var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    var output = buffer.getChannelData(0);

    for (var i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    return buffer;
  };

  Snare.prototype.trigger = function(time) {
    this.setup();

    this.noiseEnvelope.gain.setValueAtTime(1, time);
    this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    this.noise.start(time)

    this.osc.frequency.setValueAtTime(100, time);
    this.oscEnvelope.gain.setValueAtTime(0.7, time);
    this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    this.osc.start(time)

    this.osc.stop(time + 0.2);
    this.noise.stop(time + 0.2);
  };

  function createSynthesiser() {
    return new Synthesiser();
  };

  exports.createSynthesiser = createSynthesiser;
})(this);
