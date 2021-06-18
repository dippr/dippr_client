import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { Link, withRouter } from "react-router-dom";
import { UsernameDisplay } from 'components/UsernameDisplay';
import { FormHandler } from 'modules/FormHandler';
import { getUser, updateUsername } from 'controllers/User';

import logo from 'assets/logo.svg';

import 'css/navbar.css';

const formHandler = new FormHandler();

window.CLIENT_USER = null;

function Navbar(props) {
	const [cookies, setCookie, removeCookie] = useCookies(['username']);
	const [open, setOpen] = useState(true);
	const [clientUser, setClientUser] = useState(null);

	formHandler.registerInput("username", useState(""));

	const toggleNav = () => {
		setOpen(!open);
	};

	const setUsernameHandler = async () => {
		if(cookies.username.length <= 2) return;

		const clientUser = await updateUsername({
			username: cookies.username
		});
		window.CLIENT_USER = clientUser;

		updateClientUser(clientUser);
	};

	const updateClientUser = clientUser => {
		setClientUser(null);
		setClientUser(clientUser);
	};

	// Store the username in cookie.
	useEffect(() => {
		setCookie('username', formHandler.getValue("username"));
	});

	// Get the client user once at mount.
	useEffect(() => {
		getUser("me", true).then(clientUser => {
			window.CLIENT_USER = clientUser;
			
			if(clientUser) {
				formHandler.setValue("username", clientUser.username);
				updateClientUser(clientUser);
			}
		});
	}, []);

	const enableStreamingButton = clientUser && props.location.pathname !== "/stream";

	return (
		<div className={"card nav-card" + (open ? "" : " closed")}>
			<div className="card-body">
				<span className="nav-close" onClick={toggleNav}>{open ? "<<" : ">>"}</span>
				<Link to="/" className="heading text-center" alt="dippr">
					.
					<div>
						<h1>dippr</h1>
						<img className="logo" src={logo} alt="Dippr Logo" dragable="false" />
					</div>
				</Link>
				<div className="nav-settings">
					<hr />
					{
						clientUser ? <span>Your Tag: <UsernameDisplay userID={clientUser.id} noCache={true} /></span> : ""
					}
					<hr />
					<div className="mb-3">
						<label htmlFor="usernameFormInput" className="form-label">Username</label>
						<div className="input-group">
							<input
								type="text"
								className="form-control"
								id="usernameFormInput"
								placeholder="dippster"
								maxLength="15"
								onChange={formHandler.onHandler("username")}
								value={formHandler.getValue("username")}
							/>
							<span className="input-group-text">#{((clientUser || {}).id || "1234").slice(0, 4)}</span>
						</div>
					</div>

					<button className="btn btn-primary w-100" onClick={setUsernameHandler}>Set Username</button>
					<hr />
					<Link to={enableStreamingButton ? "/stream" : "#"}>
						<button
							className="btn btn-primary w-100"
							disabled={!enableStreamingButton}
						>Start Streaming</button>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default withRouter(Navbar);
