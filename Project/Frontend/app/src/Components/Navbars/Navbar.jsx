import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const location = useLocation();

    function CustomLink({ to, children, ...props }) {
        const path = location.pathname;
        const isActive = path === to;

        return (
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    to={to}
                    {...props}
                >
                    {children}
                </Link>
            </li>
        );
    }

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav mx-auto">
                        <CustomLink to="/Sampouan">Σαμπουάν</CustomLink>
                        <CustomLink to="/Afroloutra">Αφρόλουτρα</CustomLink>
                        <CustomLink to="/SapouniaXeriwn">Σαπούνια Χεριών</CustomLink>
                        <CustomLink to="/ArwmatikaXwrou">Αρωματικά Χώρου</CustomLink>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
