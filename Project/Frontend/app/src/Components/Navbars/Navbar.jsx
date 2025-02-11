import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const location = useLocation();

    const CustomLink = ({ to, children, ...props }) => {
        const isActive = location.pathname === to;
        return (
            <li className={`nav-item ${isActive ? 'active' : ''}`}>
                <Link className="nav-link" to={to} {...props}>
                    {children}
                </Link>
            </li>
        );
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav mx-auto">
                        <CustomLink to="/">Αρχική</CustomLink>
                        
                        <li className={`nav-item dropdown ${location.pathname === '/Products' ? 'active' : ''}`}>
                            <Link className="nav-link" to="/Products">
                                Προϊόντα
                            </Link>
                            <div className="dropdown-menu">
                                <div className="dropdown-columns">
                                    <div className="dropdown-column">
                                        <Link to="/Products/Afroloutra" className="nav-link">Αφρόλουτρα</Link>
                                        <Link to="/Products/category2" className="nav-link">Κατηγορία 2</Link>
                                        <Link to="/Products/category3" className="nav-link">Κατηγορία 3</Link>
                                        <Link to="/Products/category4" className="nav-link">Κατηγορία 4</Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link to="/Products/Sampouan" className="nav-link">Σαμπουάν</Link>
                                        <Link to="/Products/category2" className="nav-link">Κατηγορία 2</Link>
                                        <Link to="/Products/category3" className="nav-link">Κατηγορία 3</Link>
                                        <Link to="/Products/category4" className="nav-link">Κατηγορία 4</Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link to="/Products/ShowerGel" className="nav-link">Shower Gel</Link>
                                        <Link to="/Products/category2" className="nav-link">Κατηγορία 2</Link>
                                        <Link to="/Products/category3" className="nav-link">Κατηγορία 3</Link>
                                        <Link to="/Products/category4" className="nav-link">Κατηγορία 4</Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link to="/Products/YgraSapounia" className="nav-link">Υγρά Σαπούνια</Link>
                                        <Link to="/Products/category2" className="nav-link">Κατηγορία 2</Link>
                                        <Link to="/Products/category3" className="nav-link">Κατηγορία 3</Link>
                                        <Link to="/Products/category4" className="nav-link">Κατηγορία 4</Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link to="/Products/ArwmatikaXwrou" className="nav-link">Αρωματικά Χώρου</Link>
                                        <Link to="/Products/category2" className="nav-link">Κατηγορία 2</Link>
                                        <Link to="/Products/category3" className="nav-link">Κατηγορία 3</Link>
                                        <Link to="/Products/category4" className="nav-link">Κατηγορία 4</Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <CustomLink to="/OurCompany">Η Εταιρεία μας</CustomLink>
                    </ul>
                </div>
            </div>
        </nav>
    );
}