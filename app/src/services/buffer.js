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
        let context = this.context;
        var promise = new Promise(function(resolve, reject) {
          return context.decodeAudioData.call(context, response, resolve, reject);
        });

        return promise;
      }).then((buffer) => {
        return buffer;
      });
  }

  load() {
    return Promise.all(this.urls.map((group) => {
      return Promise.all(group.sounds.map((url) => {
        return this.loadSoundFile(url);
      }))
    }));
  }
}

export default BufferLoader;
