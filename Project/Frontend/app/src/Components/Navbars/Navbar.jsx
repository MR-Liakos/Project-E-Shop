import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import SearchBar from '../Pages/SmallComponents/SearchBar';

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
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#a6fcad" }}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src="" width="50" height="50" alt="logo" />
                </Link>

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
                        <CustomLink to="/">Αρχική</CustomLink>
                        <CustomLink to="/CreateAcc">Δημιούργησε Λογαριασμό</CustomLink>
                        <CustomLink to="/Contact">Επικοινωνία</CustomLink>
                    </ul>

                    <div className="d-flex align-items-center">
                        <SearchBar />
                        <button className='login'>Login</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
