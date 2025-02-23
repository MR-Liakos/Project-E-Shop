import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { IoClose } from "react-icons/io5";

export default function Navbar() {
    const location = useLocation();


    const CustomLink = ({ to, children, ...props }) => {
        const isActive = location.pathname === encodeURI(to);
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
            <div className="container-fluid position-relative">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#staticBackdrop"
                    aria-controls="staticBackdrop"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav mx-auto">
                        <CustomLink to="/">Αρχική</CustomLink>

                        <li className={`nav-item dropdown ${location.pathname.startsWith('/Products') ? 'active' : ''}`}>
                            <Link className="nav-link" to="/Products">
                                Προϊόντα
                            </Link>
                            <div className="dropdown-menu">
                                <div className="dropdown-columns">
                                    <div className="dropdown-column">
                                        <Link
                                            to="/Products/Shower Gel"
                                            className={`nav-link ${location.pathname === encodeURI('/Products/Shower Gel') ? 'active' : ''}`}
                                        >
                                            Shower Gel
                                        </Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link
                                            to="/Products/Shampoo"
                                            className={`nav-link ${location.pathname === encodeURI('/Products/Shampoo') ? 'active' : ''}`}
                                        >
                                            Shampoo
                                        </Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link
                                            to="/Products/Body Lotion"
                                            className={`nav-link ${location.pathname === encodeURI('/Products/Body Lotion') ? 'active' : ''}`}
                                        >
                                            Body Lotion
                                        </Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link
                                            to="/Products/Liquid Soap"
                                            className={`nav-link ${location.pathname === encodeURI('/Products/Liquid Soap') ? 'active' : ''}`}
                                        >
                                            Liquid Soap
                                        </Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link
                                            to="/Products/Room Sprey"
                                            className={`nav-link ${location.pathname === encodeURI('/Products/Room Sprey') ? 'active' : ''}`}
                                        >
                                            Room Sprey
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <CustomLink to="/OurCompany">Η Εταιρεία μας</CustomLink>
                    </ul>
                </div>

                <div className="offcanvas offcanvas-start " data-bs-backdrop="static" tabIndex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
                    <div className="offcanvas-header">
                        <button type="button" className='btn-close-toggle' data-bs-dismiss="offcanvas" aria-label="Close">
                            <IoClose />
                        </button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="ul-mobile">
                        <CustomLink to="/">Αρχική</CustomLink>
                        <li className={`nav-item dropdown ${location.pathname.startsWith('/Products') ? 'active' : ''}`}>
                            <Link className="nav-link" to="/Products">
                                Προϊόντα
                            </Link>
                            <div className="dropdown-menu">
                                <div className="mobile-dropdown-columns">
                                    <div className="mobile-dropdown-column">
                                        <Link
                                            to="/Products/Shower Gel"
                                            className={`nav-link ${location.pathname === encodeURI('/Products/Shower Gel') ? 'active' : ''}`}
                                        >
                                            Shower Gel
                                        </Link>
                                    </div>
                                    <div className="mobile-dropdown-column">
                                        <Link
                                            to="/Products/Shampoo"
                                            className={`nav-link ${location.pathname === encodeURI('/Products/Shampoo') ? 'active' : ''}`}
                                        >
                                            Shampoo
                                        </Link>
                                    </div>
                                    <div className="mobile-dropdown-column">
                                        <Link
                                            to="/Products/Body Lotion"
                                            className={`nav-link ${location.pathname === encodeURI('/Products/Body Lotion') ? 'active' : ''}`}
                                        >
                                            Body Lotion
                                        </Link>
                                    </div>
                                    <div className="mobile-dropdown-column">
                                        <Link
                                            to="/Products/Liquid Soap"
                                            className={`nav-link ${location.pathname === encodeURI('/Products/Liquid Soap') ? 'active' : ''}`}
                                        >
                                            Liquid Soap
                                        </Link>
                                    </div>
                                    <div className="mobile-dropdown-column">
                                        <Link
                                            to="/Products/Room Sprey"
                                            className={`nav-link ${location.pathname === encodeURI('/Products/Room Sprey') ? 'active' : ''}`}
                                        >
                                            Room Sprey
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <CustomLink to="/OurCompany">Η Εταιρεία μας</CustomLink>

                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}