import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import Main from 'pages/Main';
import Watch from 'pages/Watch';
import Stream from 'pages/Stream';
import Navbar from 'components/Navbar';

import 'vendor/style.min.css';
import 'css/global.css';
import 'css/index.css';

window.API = path => `${process.env.REACT_APP_API_URL}${path}`;

function App() {
	return (
		<Router>
			<div className="app">
				<Navbar />
				<div className="card main-card">
					<div className="card-body">
						<Switch>
							<Route path="/stream">
								<Stream />
							</Route>
							<Route path="/watch">
								<Watch />
							</Route>
							<Route path="/">
								<Main />
							</Route>
						</Switch>
					</div>
				</div>
			</div>
		</Router>
	);
}

export default App;
