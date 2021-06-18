const CACHE = {
	STREAMS: {
		CACHE_AGE: 0,
		VALUE: []
	}
};

const listStreams = async () => {
	if(Date.now() - CACHE.STREAMS.CACHE_AGE < 2500) {
		return CACHE.STREAMS.VALUE;
	}

	return await fetch(window.API("/streams")).then(res => res.json()).then(result => {
		if(result.err) return new Error(result.err);

		CACHE.STREAMS.CACHE_AGE = Date.now();
		CACHE.STREAMS.VALUE = result.streams;

		return result.streams;
	}, (error) => {
		return new Error(error);
	});
};

export {
	listStreams
};