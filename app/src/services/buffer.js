class BufferLoader {
  constructor(context, urls) {
    this.context = context;
    this.urls = urls;
    this.buffer = [];
  }

  loadSoundFile(url) {
    return fetch(url)
      .then((response) => response.arrayBuffer())
      .then((response) => {
        return this.context.decodeAudioData(response, (buffer) => {
          return buffer;
        })
      });
  }

  load() {
    return Promise.all(this.urls.map((url) => {
      return this.loadSoundFile(url);
    }));
  }
}

export default BufferLoader;
