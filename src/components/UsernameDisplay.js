import React, { useState, useEffect } from 'react';

import { getUser } from 'controllers/User';

import 'css/username-display.css';

function UsernameDisplay(props) {
	const [user, setUser] = useState([]);
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		getUser(props.userID, props.noCache).then(user => {
			if(!user) return setIsLoaded(false);
			setIsLoaded(true);
			setUser(user);
		}).catch(err => {
			setIsLoaded(true);
			setError(err);
		});
	}, [props.userID, props.noCache]);

	let body = "";

	if(error) {
		body = <span>{JSON.stringify(error)}</span>
	} else if(isLoaded) {
		body = (
			<>
				<span>{user.username}</span>
				#
				{user.id}
			</>
		);
	} else {
		body = (
			<>
				<b>Loading...</b>
				#
				{user.id}
			</>
		);
	}

	return <div className="username-display">{body}</div>;
}

export { UsernameDisplay };
