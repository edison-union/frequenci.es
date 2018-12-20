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
    }).catch((err) => {
      console.log(err);
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
    filter.Q.value = 30;
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
    const note = 55;
    const scale = [0.0, 2.0, 4.0];
    const oscillators = 25;
    for (let i = 0; i < oscillators; i++) {
      var degree = Math.floor(Math.random() * scale.length);
      var frequency = this.mtof(note + scale[degree]);
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
    const panner = new PannerNode(this.context, {
      panningModel: 'HRTF',
      distanceModel: 'linear',
      positionX: options.spatial_data.x,
      positionY: 0, //options.spatial_data.y,
      positionZ: 0, //options.spatial_data.z,
      refDistance: 0,
      maxDistance: 10,
      rolloffFactor: 2,
      coneInnerAngle: 30,
      coneOuterAngle: 40,
      coneOuterGain: .7
    });

    source.buffer = this.buffer[group][sound];

    if (options.spatialAudioEnabled) {
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
