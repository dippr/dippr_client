import React, { useState, useEffect } from 'react';
import {
	Redirect,
	withRouter
} from "react-router-dom";

import { UsernameDisplay } from 'components/UsernameDisplay';
import StreamPlayer from 'components/StreamPlayer';

import 'css/watch.css';

function Watch(props) {
	const [stream, setStream] = useState(null);

	const queryParams = new URLSearchParams(window.location.search);
	const streamID = queryParams.get("id");

	useEffect(() => {
		fetch(window.API("/stream/" + streamID)).then(res => res.json()).then(result => {
			if(!result.stream) {
				props.history.push('/');
			} else {
				setStream(result.stream);
			}
		}, (error) => {
			props.history.push('/');
		});
	}, [props.history, streamID]);

	if(!streamID) return <Redirect to="/" />;
	if(!stream) return <div>Loading...</div>

	return (
		<>
			<div className="row h-100">
				<div className="col-9">
					<div className="stream-container">
						<StreamPlayer streamID={streamID} />
					</div>
					<h1 className="stream-title">{stream.title}</h1>
					<span>Streamer: <small><UsernameDisplay userID={stream.streamerID} noCache={true} /></small></span>
				</div>
				<div className="col-3 chat-row">
					x
				</div>
			</div>
		</>
	);
}

export default withRouter(Watch);
