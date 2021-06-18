import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";

import { Livestreamer } from 'controllers/Streaming';
import { FormHandler } from 'modules/FormHandler';

import 'css/stream.css';

let livestreamer;
const formHandler = new FormHandler();

const handleChangeWindowClick = async () => {
	await livestreamer.requestInputSource();
};

const handleSaveSettingsClick = () => {};

function Stream(props) {
	const [stream, setStream] = useState(null);

	formHandler.registerInput("streamTitle", useState(""));

	const handleStartStreamingClick = async () => {
		const response = await livestreamer.startStream({
			title: formHandler.getValue("streamTitle") || "Dippr Stream"
		});

		setStream(response.stream);
	};

	const handleStopStreamingClick = async () => {
		livestreamer.destroy();
		livestreamer = new Livestreamer();

		livestreamer.onClose = () => {
			setStream(null);
		};
	};

	useEffect(() => {
		if(!livestreamer) return;
		const outputCanvasContainer = document.querySelector("#outputCanvasContainer");
		if(!outputCanvasContainer) return;

		outputCanvasContainer.appendChild(livestreamer.canvas);

		return () => {
			const outputCanvasContainer = document.querySelector("#outputCanvasContainer");
			if(!livestreamer) return;
			if(!outputCanvasContainer) return;
			outputCanvasContainer.removeChild(livestreamer.canvas);
		};
	});

	useEffect(() => {
		livestreamer = new Livestreamer();

		livestreamer.onClose = () => {
			setStream(null);

			handleStopStreamingClick();
		};

		return () => {
			livestreamer.destroy();
			livestreamer = null;
		};
	}, []);

	if(!window.CLIENT_USER) {
		return <Redirect to="/" />;
	}

	return (
		<>
			<div className="row h-100">
				<div className="col-8 card-column">
					<div className="card stream-output-card">
						<div className="card-body">
							<h3>Stream Output</h3>
							<hr />
							{stream ? <div id="outputCanvasContainer"></div> : <p className="text-center">You aren't streaming anything!</p>}
						</div>
					</div>
					<div className="card stream-settings-card">
						<div className="card-body">
							<h3>Settings</h3>
							<hr />
							<div className="mb-3">
								<label htmlFor="streamTitleInput" className="form-label">Stream Title</label>
								<input
									type="text"
									className="form-control"
									id="streamTitleInput"
									placeholder="Just Streaming..."
									onChange={formHandler.onHandler("streamTitle")}
									value={formHandler.getValue("streamTitle")}
								/>
							</div>
							<button className="btn btn-secondary w-100" onClick={handleChangeWindowClick} disabled={!stream}>Change Window</button>
							<hr />
							{
								stream ? (
									<div className="btn-group w-100" role="group" aria-label="Basic example">
										<button className="btn btn-primary" onClick={handleSaveSettingsClick}>Save Settings</button>
										<button className="btn btn-danger" onClick={handleStopStreamingClick}>Stop Streaming</button>
									</div>
								) : (
									<button className="btn btn-primary w-100" onClick={handleStartStreamingClick}>Start Streaming</button>
								)

							}
						</div>
					</div>
				</div>
				<div className="col-4 card-column">
					<div className="card stream-chat-card">
						<div className="card-body">
							<h3>Chat</h3>
							<hr />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Stream;
