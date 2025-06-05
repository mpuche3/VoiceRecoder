(async function () {

  const constraints = {
    audio: {
      sampleRate: 48000,
      channelCount: 1,
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false
    }
  };

  let mediaRecorder;
  let audioChunks = [];
  let audio;

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const options = {};
    if (MediaRecorder.isTypeSupported('audio/webm; codecs=opus')) {
      options.mimeType = 'audio/webm; codecs=opus';
    } else if (MediaRecorder.isTypeSupported('audio/ogg; codecs=opus')) {
      options.mimeType = 'audio/ogg; codecs=opus';
    }
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.addEventListener('dataavailable', event => audioChunks.push(event.data));

    mediaRecorder.addEventListener('stop', () => {
      const blob = new Blob(audioChunks, { type: options.mimeType || 'audio/webm' });
      audioChunks = [];

      if (audio) URL.revokeObjectURL(audio.src);

      const url = URL.createObjectURL(blob);
      audio = new Audio(url);
      audio.play();
    });
  } catch (err) {
    alert('Error accessing microphone: ' + err.message);
  }

  let holdingEnter = false;

  document.addEventListener('keydown', event => {
    if (event.key === 'Enter' && mediaRecorder && mediaRecorder.state === 'inactive' && !event.repeat) {
      holdingEnter = true;
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
      audioChunks = [];
      mediaRecorder.start();
    }
  });

  document.addEventListener('keyup', event => {
    if (event.key === 'Enter' && holdingEnter && mediaRecorder && mediaRecorder.state === 'recording') {
      holdingEnter = false;
      mediaRecorder.stop();
    }
  });

})();
