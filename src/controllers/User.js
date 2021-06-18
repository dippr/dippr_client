const CACHE_LIFE = 60 * 60000;

const CACHE = {
	USERS: {}
};

const getUser = async (userID, noCache) => {
	if(CACHE.USERS[userID] && !noCache) {
		if(Date.now() - CACHE.USERS[userID].CACHE_AGE < CACHE_LIFE) {
			return CACHE.USERS[userID].VALUE;
		}
	}

	return await fetch(window.API("/user/" + userID)).then(res => res.json()).then(result => {
		if(result.err) return new Error(result.err);

		CACHE.USERS[userID] = {};
		CACHE.USERS[userID].CACHE_AGE = Date.now();
		CACHE.USERS[userID].VALUE = result.user;

		return result.user;
	}, (error) => {
		return new Error(error);
	});
};

const updateUsername = async ({username}) => {
	return await fetch(window.API("/update_username"), {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			username
		})
	}).then(res => res.json()).then(result => {
		if(result.err) return new Error(result.err);

		return result.user;
	}, (error) => {
		return new Error(error);
	});
}; 

export {
	getUser,
	updateUsername
};