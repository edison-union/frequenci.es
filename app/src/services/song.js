class Song {
  constructor() {
    this.tempo = process.env.TEMPO;
    this.beatsPerBar = process.env.BEATS_PER_BAR;
    this.beatValue = process.env.BEAT_VALUE;
    this.barLength = this.tempo / 60 * 1000;
  }

  getNoteDelay(beat, type = this.barLength) {
    return beat * this.barLength / type;
  }

  getBars(bars) {
    return this.getNoteDelay(this.beatsPerBar, bars);
  }
}

export default Song;
