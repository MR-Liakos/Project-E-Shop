import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { IoClose } from "react-icons/io5";
import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

export default function Navbar() {
    const location = useLocation();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [offcanvasVisible, setOffcanvasVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };

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
    const openOffcanvas = () => {
        setOffcanvasVisible(true);
        // Προσθέτουμε την κλάση show μέσω Bootstrap ή δικό μας state
        document.getElementById('staticBackdrop').classList.add('show');
    };

    // Συνάρτηση για κλείσιμο offcanvas με transition
    const handleCloseOffcanvas = () => {
        const offcanvasEl = document.getElementById('staticBackdrop');
        // Αφαιρούμε την κλάση show για να ενεργοποιηθεί το transition
        offcanvasEl.classList.remove('show');
        // Μετά το τέλος της μετάβασης (300ms) αλλάζουμε το state ώστε να κρυφτεί το offcanvas
        setTimeout(() => {
            setOffcanvasVisible(false);
        }, 300);
    };
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid position-relative">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-target="#staticBackdrop"
                    aria-controls="staticBackdrop"
                    onClick={openOffcanvas}
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

                {
                    offcanvasVisible && (
                        <div className="offcanvas offcanvas-start mobile-navbar" data-bs-backdrop="static" tabIndex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
                            <div className="offcanvas-header">
                                <button type="button"
                                    className='btn-close-toggle'
                                    onClick={handleCloseOffcanvas}
                                    aria-label="Close">
                                    <IoClose />
                                </button>
                            </div>
                            <div className="offcanvas-body">

                                <ul className="ul-mobile">

                                    <CustomLink to="/">Αρχική</CustomLink>

                                    <li className={`nav-item dropdown ${location.pathname.startsWith('/Products') ? 'active' : ''} ${dropdownOpen ? 'show' : ''}`}>
                                        <button className="nav-link btn-dropdown" onClick={toggleDropdown}>
                                            Προϊόντα
                                            <IoIosArrowDown className={`dropdown-arrow ${dropdownOpen ? 'rotated' : ''}`} />
                                        </button>

                                        <div className="mobile-dropdown-menu">

                                            <div className="mobile-dropdown-columns">
                                                <Link
                                                    to="/Products/"
                                                    className={`nav-link ${location.pathname === encodeURI('/Products/') ? 'active' : ''}`}
                                                >
                                                    Όλα τα Προϊόντα
                                                </Link>
                                                <Link
                                                    to="/Products/Shower Gel"
                                                    className={`nav-link ${location.pathname === encodeURI('/Products/Shower Gel') ? 'active' : ''}`}
                                                >
                                                    Shower Gel
                                                </Link>
                                                <Link
                                                    to="/Products/Shampoo"
                                                    className={`nav-link ${location.pathname === encodeURI('/Products/Shampoo') ? 'active' : ''}`}
                                                >
                                                    Shampoo
                                                </Link>
                                                <Link
                                                    to="/Products/Body Lotion"
                                                    className={`nav-link ${location.pathname === encodeURI('/Products/Body Lotion') ? 'active' : ''}`}
                                                >
                                                    Body Lotion
                                                </Link>
                                                <Link
                                                    to="/Products/Liquid Soap"
                                                    className={`nav-link ${location.pathname === encodeURI('/Products/Liquid Soap') ? 'active' : ''}`}
                                                >
                                                    Liquid Soap
                                                </Link>
                                                <Link
                                                    to="/Products/Room Sprey"
                                                    className={`nav-link ${location.pathname === encodeURI('/Products/Room Sprey') ? 'active' : ''}`}
                                                >
                                                    Room Sprey
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                    <CustomLink to="/OurCompany">Η Εταιρεία μας</CustomLink>

                                </ul>
                            </div>
                        </div>
                    )
                }

            </div>
        </nav>
    );
}