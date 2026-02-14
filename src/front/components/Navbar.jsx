import { Link, useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {

	const navigate = useNavigate();
	const location = useLocation();
	const token = localStorage.getItem("token");

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/");
	};

	return (
		<nav className="navbar custom-navbar">
			<div className="container">
					<span className="navbar-brand mb-0 h1">Autenticación JWT</span>

				<div className="ml-auto">

					{!token ? (
						<>
							<Link to="/" className="me-2">
								<button className="nav-btn">
									Login
								</button>
							</Link>

							<Link to="/signup">
								<button className="nav-btn">
									Register
								</button>
							</Link>
						</>
					) : (
						<>
							{location.pathname !== "/private" && (
								<Link to="/private" className="me-2">
									<button className="nav-btn">
										Private
									</button>
								</Link>
							)}

							<button
								className="nav-btn nav-btn-danger"
								onClick={handleLogout}
							>
								Logout
							</button>
						</>
					)}

				</div>
			</div>
		</nav>
	);
};
