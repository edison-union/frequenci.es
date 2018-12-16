class BufferLoader {
  constructor(context, urls) {
    this.context = context;
    this.urls = urls;
    this.buffer = [];
    console.log(urls);
  }

  loadSoundFile(url, type) {
    return fetch(url)
      .then((response) => response.arrayBuffer())
      .then((response) => {
        return this.context.decodeAudioData(response, (buffer) => {
          return {
            type,
            buffer
          }
        });
      });
  }

  load() {
    return Promise.all(this.urls.map((group) => {
      return Promise.all(group.sounds.map((url) => {
        return this.loadSoundFile(url, group.type);
      }))
    }));
  }
}

export default BufferLoader;
