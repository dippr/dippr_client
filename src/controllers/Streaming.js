const RECORDING_OPTIONS = {
	mimeType: 'video/webm;codecs=h264',
	videoBitsPerSecond: 5 * 1024 * 1024
};

class Livestreamer {
	constructor() {
		this.canvas = null;
		this.canvasCtx = null;
		this.canvasStream = null;
		this.createCanvas();

		this.currentVideo = document.createElement('video');
		this.currentVideo.width = 1280;
		this.currentVideo.height = 720;
		this.currentVideo.autoplay = true;

		this.currentStream = null;

		this.mediaRecorder = new MediaRecorder(this.canvasStream, RECORDING_OPTIONS);
		this.streamSocket = null;
		this.onClose = () => {};

		this.mediaRecorder.ondataavailable = event => {
			if(!this.streamSocket) return;

			if (event.data.size > 0) {
				this.streamSocket.send(new Blob([event.data], {
					type: 'video/webm; codecs=h264',
				}));
			} else {}
		};

		this.mediaRecorder.start(1000);

		this.canvasInterval = setInterval(() => {
			this.canvasCtx.drawImage(this.currentVideo, 0, 0, this.canvas.width, this.canvas.height);
		}, 1000 / 30);
	}

	createCanvas() {
		this.canvas = document.createElement('canvas');
		this.canvasCtx = this.canvas.getContext('2d');

		this.canvas.width = 1280;
		this.canvas.height = 720;

		this.canvasStream = this.canvas.captureStream(30);
	}

	requestInputSource() {
		return new Promise(async (resolve, reject) => {
			try {
				this.currentStream = await navigator.mediaDevices.getDisplayMedia({
					video: true,
					audio: true
				});

				this.currentVideo.srcObject = this.currentStream;
			} catch(err) {
				console.error("Error: " + err);

				return reject(err);
			}

			resolve(this.currentStream);
		});
	}

	async startStream({
		title
	}) {
		const response = await fetch(window.API("/create_stream"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				title
			})
		}).then(r => r.json());

		if(response.err) {
			return alert("Error: " + response);
		}

		const streamCredentials = {
			id: response.stream.id,
			streamKey: response.streamKey
		};

		document.cookie = 'X-Authorization=' + btoa(JSON.stringify(streamCredentials)) + '; path=/';

		this.streamSocket = new WebSocket(`${process.env.REACT_APP_STREAM_URL.replace("http", "ws")}/socket`);

		this.streamSocket.addEventListener('open', heartbeat);
		this.streamSocket.addEventListener('message', heartbeat);
		this.streamSocket.addEventListener('close', () => {
			clearTimeout(this.streamSocket.pingTimeout);
			this.streamSocket = null;
			this.onClose();
		});

		return {
			stream: response.stream,
			streamKey: response.streamKey
		};
	}

	destroyMediaRecorder() {
		try {
			this.mediaRecorder.ondataavailable = null;
			this.mediaRecorder.stop();
			// this.streamSocket.send("reset");
		} catch (e) { console.log(e); }
		this.mediaRecorder = null;
	}

	destroy() {
		clearInterval(this.canvasInterval);
		killCaptureStream(this.currentStream);
		this.currentStream = null;
		this.canvas = null;
		this.canvasCtx = null;
		this.canvasStream = null;


		this.destroyMediaRecorder();
		if(this.streamSocket) this.streamSocket.close();
	}
}

function killCaptureStream(stream) {
	if(!stream) return;
	
	let tracks = stream.getTracks();

	tracks.forEach(track => track.stop());
	stream = null;
}

function heartbeat() {
	clearTimeout(this.pingTimeout);

	this.pingTimeout = setTimeout(() => {
		this.close();
	}, 15000 + 1000);
}

export {
	Livestreamer
};