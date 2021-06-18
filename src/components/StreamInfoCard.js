import { withRouter } from "react-router-dom";

import 'css/stream-info-card.css';

function StreamInfoCard(props) {
	const handleClick = () => {
		return props.history.push('/watch?id=' + props.streamID);
	};

	return (
		<div className="stream-info-card" onClick={handleClick}>
			<div className="card">
				<div className="card-body">
					
				</div>
			</div>
			<p className="stream-title">{props.streamTitle || "Stream Title"}</p>
		</div>
	);
}

export default withRouter(StreamInfoCard);
