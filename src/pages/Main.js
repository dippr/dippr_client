import React, { useState, useEffect } from 'react';

import { listStreams } from 'controllers/StreamList';
import StreamInfoCard from 'components/StreamInfoCard';

import 'css/main.css';

function Main() {
	const [streams, setStreams] = useState([]);
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		listStreams().then(streams => {
			setIsLoaded(true);
			setStreams(streams);
		}).catch(err => {
			setIsLoaded(true);
			setError(err);
		});
	});

	const refreshStreams = () => {
		setStreams([]);
	};

	let body;

	if(error){
		body = <div>Error: {error.message}</div>;
	} else if(!isLoaded){
		body = <div>Loading...</div>;
	} else {
		const streamInfoCards = streams.map((s, idx) => {
			return <StreamInfoCard
				key={idx}
				streamTitle={s.title}
				streamID={s.id}
			/>
		});

		body = (
			<div className="stream-info-card-container">
				{streamInfoCards}
			</div>
		);
	}

	return (
		<>
			<h1 className="text-center">Streams</h1>
			<hr />
			<button className="btn btn-primary w-100" onClick={refreshStreams}>Refresh</button>
			<hr />
			{body}
		</>
	);
}

export default Main;
