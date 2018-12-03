class AudioService {
  constructor() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new window.AudioContext();
  }

  arrivalSound(time = 0.125) {
    let oscillator = this.context.createOscillator();

    oscillator.connect(this.context.destination);
    oscillator.type = 'saw';
    oscillator.frequency.value = 500;
    oscillator.start(this.ccontext.currentTime);
    oscillator.stop(this.context.currentTime + time);
  }

  departureSound(time = 0.125) {
    let oscillator = this.context.createOscillator();

    oscillator.connect(this.context.destination);
    oscillator.type = 'saw';
    oscillator.frequency.value = 300;
    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + time);
  }

  destroy() {
    if (this.context) {
      this.context.close();
    }
  }
}

export default AudioService;
