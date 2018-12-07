import BufferLoader from './buffer'

class AudioService {
  constructor() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new window.AudioContext();
    this.bufferLoader = new BufferLoader(this.context, [
      '/sounds/ping-c.wav',
      '/sounds/ping-d.wav',
      '/sounds/ping-e.wav'
    ]);
    this.buffer = [];
    this.bufferLoader.load().then((buffer) => {
      this.buffer = buffer;
    });
    this.noiseNodes = [];
  }

  createNoiseGen(frequency) {
    const gain = this.context.createGain();
    gain.gain.value = 0.15;
    gain.connect(this.context.destination);
    const filter = this.context.createBiquadFilter();
    const panner = this.context.createPanner();
    const bufferLen = 4096;
    const max = 20;
    const min = -20;

    let x = this.rand(min, max);
    let y = this.rand(min, max);
    let z = this.rand(min, max);
    panner.setPosition(x, y, z);
    panner.connect(gain);

    filter.type = filter.BANDPASS;
    filter.frequency.value = frequency;
    filter.Q.value = 50;
    filter.connect(panner);

    const noise = this.context.createScriptProcessor(bufferLen, 1, 2);
    noise.onaudioprocess = (e) => {
      const bufferL = e.outputBuffer.getChannelData(0);
      const bufferR = e.outputBuffer.getChannelData(1);

      for (let i = 0; i < bufferLen; i++) {
        bufferL[i] = bufferR[i] = Math.random() * 2 - 1;
      }
    }

    noise.connect(filter);
    this.noiseNodes.push(noise);

    setInterval(() => {
      x = x + this.rand(-0.1, 0.1);
      y = y + this.rand(-0.1, 0.1);
      z = z + this.rand(-0.1, 0.1);
      panner.setPosition(x, y, z);
    }, 500);
  }

  rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  mtof(m) {
    return Math.pow(2, (m - 69) / 12) * 440;
  }

  backgroundSound() {
    const note = 45;
    const scale = [0.0, 2.0, 4.0, 6.0, 7.0, 9.0, 11.0, 12.0, 14.0];
    const oscillators = 40;
    for (let i = 0; i < oscillators; i++) {
      var degree = Math.floor(Math.random() * scale.length);
      var frequency = this.mtof(note + scale[degree]);
      frequency += Math.random() * 4 - 2;
      this.createNoiseGen(frequency);
    }
  }

  departureSound() {
    const source = this.context.createBufferSource();
    source.buffer = this.buffer[Math.round(Math.random()*this.buffer.length)];
    source.connect(this.context.destination);
    source.start();
  }

  destroy() {
    if (this.context) {
      this.context.close();
    }
  }
}

export default AudioService;
