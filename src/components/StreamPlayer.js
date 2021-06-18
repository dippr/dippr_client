import React, { useState, useEffect } from 'react';
import Hls from 'hls.js';

import 'css/stream-player.css';

function StreamPlayer(props) {
	const queryParams = new URLSearchParams(window.location.search);
	const streamID = queryParams.get("id");

	useEffect(() => {
		const hls = new Hls({
			liveSyncDurationCount: 1
		});
		const video = document.querySelector(".stream-video");

		hls.loadSource(`${process.env.REACT_APP_STREAM_URL}/streams/${props.streamID}/stream.m3u8`);
		hls.attachMedia(video);
		video.play();
	}, [props.streamID]);

	if (!Hls.isSupported()) return <div>Unfortunately, your browser does not support HLS.</div>;

	return (
		<div className="stream-player">
			<video className="stream-video" width="1280" height="720" autoPlay controls></video>
		</div>
	);
}

export default StreamPlayer;
