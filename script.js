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

    const circle = document.getElementById('circle');
    let mediaRecorder;
    let audioChunks = [];
    let audio;
    let lastBlob = null;

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
            lastBlob = blob;

            if (audio) URL.revokeObjectURL(audio.src);

            const url = URL.createObjectURL(blob);
            audio = new Audio(url);
            audio.addEventListener('play', () => changeState('replaying'));
            audio.addEventListener('ended', () => changeState('idle'));

            audio.play();
        });
    } catch (err) {
        alert('Error accessing microphone: ' + err.message);
    }

    document.addEventListener('keydown', event => {
        const key = event.key.toLowerCase();

        if ((key === 's' || key === 'enter') && mediaRecorder && mediaRecorder.state === 'inactive' && !event.repeat) {
            if (audio && !audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }
            audioChunks = [];
            mediaRecorder.start();
            changeState('recording');
        }

        if (key === 'r' && audio && !event.repeat) {
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }
            audio.play();
        }

        if (key === 'd' && lastBlob && !event.repeat) {
            const url = URL.createObjectURL(lastBlob);
            const a = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            a.href = url;
            a.download = `recording_${timestamp}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });

    document.addEventListener('keyup', event => {
        const key = event.key.toLowerCase();
        if ((key === 's' || key === 'enter') && mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    });

    document.body.addEventListener('touchstart', (e) => {
        if (mediaRecorder && mediaRecorder.state === 'inactive') {
            audioChunks = [];
            mediaRecorder.start();
            changeState('recording');
        }
    });

    document.body.addEventListener('touchend', (e) => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    });

    circle.addEventListener('click', () => {
        if (!audio) return;
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
        audio.play();
    });

    circle.addEventListener('touchstart', e => {
        e.stopPropagation();
        if (!audio) return;
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
        audio.play();
    });

    changeState('idle');
})();
