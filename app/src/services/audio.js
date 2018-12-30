import BufferLoader from './buffer'
import { AirportConstants } from '../constants/airports'
import { scale } from '../util/number'

class AudioService {
  constructor() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new window.AudioContext();
    this.bufferLoader = new BufferLoader(this.context, Object.keys(AirportConstants).map((key) => AirportConstants[key]));
    this.buffer = [];
    this.bufferLoader.load().then((buffer) => {
      this.buffer = buffer;
      if (this.onReady) {
        this.onReady();
      }
    }).catch((err) => {
      console.log(err);
    });
    this.noiseNodes = [];
  }

  createNoiseGen(frequency) {
    const gain = this.context.createGain();
    gain.gain.value = 0.25;
    gain.connect(this.context.destination);
    const filter = this.context.createBiquadFilter();
    const panner = this.context.createPanner();
    const bufferLen = 4096;
    const max = 30;
    const min = -30;

    let x = this.rand(min, max);
    let y = this.rand(min, max);
    let z = this.rand(min, max);
    panner.setPosition(x, y, z);
    panner.connect(gain);

    filter.type = filter.HIGHPASS;
    filter.frequency.value = frequency;
    filter.Q.value = 20;
    filter.connect(panner);

    const noise = this.context.createScriptProcessor(bufferLen, 1, 2);
    noise.onaudioprocess = (e) => {
      const bufferL = e.outputBuffer.getChannelData(0);
      const bufferR = e.outputBuffer.getChannelData(1);

      for (let i = 0; i < bufferLen; i++) {
        // Web Audio API in iOS sucks
        // createScriptProcessor is choppy AF and no alternative is available until
        // AudioWorklets receive full support
        // So we set the value to 0 so it's silent, and keeps the audio context running
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

  backgroundSound() {
    const note = 70;
    const oscillators = 20;

    for (let i = 0; i < oscillators; i++) {
      var frequency = Math.pow(2, (note - 69) / 12) * 440
      frequency += Math.random() * 4 - 2;
      this.createNoiseGen(frequency);
    }
  }

  mapHeightToNote(height) {
    const max = Object.keys(AirportConstants).map((key) => AirportConstants[key]).reduce((a, b) => {
      if (a < b.sounds.length) {
        return b.sounds.length-1;
      }
      return a;
    }, 0);

    const value = scale(height, 0, process.env.AIRCRAFT_CEILING, 0, max);

    return value > max ? max : Math.round(value);
  }

  departureSound(options) {
    const source = this.context.createBufferSource();
    const group = Object.keys(AirportConstants).indexOf(options.type);
    const sound = this.mapHeightToNote(options.height);
    source.buffer = this.buffer[group][sound];

    if (window.PannerNode) {
      const panner = new PannerNode(this.context, {
        panningModel: 'HRTF',
        distanceModel: 'linear',
        positionX: options.spatialData.x,
        positionY: options.spatialData.y,
        positionZ: options.spatialData.z,
        refDistance: 0,
        maxDistance: 10,
        rolloffFactor: 3,
        coneInnerAngle: 5,
        coneOuterAngle: 30,
        coneOuterGain: .7
      });
      source.connect(panner).connect(this.context.destination);
    } else {
      source.connect(this.context.destination);
    }

    source.start();
  }

  destroy() {
    if (this.context) {
      this.context.close();
    }
  }
}

export default AudioService;
