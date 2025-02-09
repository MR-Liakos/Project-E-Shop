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
                                Όλα τα Προϊόντα
                            </Link>
                            <div className="dropdown-menu">
                                <div className="dropdown-columns">
                                    <div className="dropdown-column">
                                        <Link to="/products/Αφρόλουτρα" className="nav-link">Αφρόλουτρα</Link>
                                        <Link to="/products/category2" className="nav-link">Κατηγορία 2</Link>
                                        <Link to="/products/category3" className="nav-link">Κατηγορία 3</Link>
                                        <Link to="/products/category4" className="nav-link">Κατηγορία 4</Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link to="/products/Σαμπουάν" className="nav-link">Σαμπουάν</Link>
                                        <Link to="/products/category2" className="nav-link">Κατηγορία 2</Link>
                                        <Link to="/products/category3" className="nav-link">Κατηγορία 3</Link>
                                        <Link to="/products/category4" className="nav-link">Κατηγορία 4</Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link to="/products/ShowerGel" className="nav-link">Shower Gel</Link>
                                        <Link to="/products/category2" className="nav-link">Κατηγορία 2</Link>
                                        <Link to="/products/category3" className="nav-link">Κατηγορία 3</Link>
                                        <Link to="/products/category4" className="nav-link">Κατηγορία 4</Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link to="/products/ΥγράΣαπούνια" className="nav-link">Υγρά Σαπούνια</Link>
                                        <Link to="/products/category2" className="nav-link">Κατηγορία 2</Link>
                                        <Link to="/products/category3" className="nav-link">Κατηγορία 3</Link>
                                        <Link to="/products/category4" className="nav-link">Κατηγορία 4</Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link to="/products/ΑρωματικάΧώρου" className="nav-link">Αρωματικά Χώρου</Link>
                                        <Link to="/products/category2" className="nav-link">Κατηγορία 2</Link>
                                        <Link to="/products/category3" className="nav-link">Κατηγορία 3</Link>
                                        <Link to="/products/category4" className="nav-link">Κατηγορία 4</Link>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <CustomLink to="/company">Η Εταιρεία μας</CustomLink>
                    </ul>
                </div>
            </div>
        </nav>
    );
}