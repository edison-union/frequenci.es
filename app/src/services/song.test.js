import Song from './song'

const song = new Song();
song.tempo = 120;
song.beatsPerBar = 4;
song.beatValue = 4;
song.barLength = song.tempo / 60 * 1000;

describe("Song", () => {
  it ("Eigth note delay is correct", () => {
    expect(song.getNoteDelay(.5, 4)).toEqual(250);
  })

  it ("Quarter note delay is correct", () => {
    expect(song.getNoteDelay(1, 4)).toEqual(500);
  })

  it ("Half note delay is correct", () => {
    expect(song.getNoteDelay(2, 4)).toEqual(1000);
  })

  it ("Whole note delay is correct", () => {
    expect(song.getNoteDelay(4, 4)).toEqual(2000);
  })

  it ("1 bar delay is correct", () => {
    expect(song.getBars(1)).toEqual(2000);
  })

  it ("2 bar delay is correct", () => {
    expect(song.getBars(2)).toEqual(4000);
  })

  it ("3 bar delay is correct", () => {
    expect(song.getBars(3)).toEqual(6000);
  })

  it ("4 bar delay is correct", () => {
    expect(song.getBars(4)).toEqual(8000);
  })
})
