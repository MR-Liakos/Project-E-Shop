import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { IoClose } from "react-icons/io5";
import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

export default function Navbar() {
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isOffcanvasShown, setIsOffcanvasShown] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };

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
    const openOffcanvas = () => {
        const offcanvasEl = document.getElementById('staticBackdrop');
        if (offcanvasEl) {
            offcanvasEl.classList.add('show');
            offcanvasEl.style.visibility = 'visible';
            setIsOffcanvasShown(true);
        }
    };

    const handleCloseOffcanvas = () => {
        const offcanvasEl = document.getElementById('staticBackdrop');
        if (offcanvasEl) {
            offcanvasEl.classList.remove('show');
            setTimeout(() => {
                offcanvasEl.style.visibility = 'hidden';
                setIsOffcanvasShown(false);
            }, 300); // Πρέπει να ταιριάζει με το transition duration
        }
        if (dropdownOpen) {
            toggleDropdown()
        }
    };
    
    const handleDropdownLinkClick = () => {
        const dropdown = document.querySelector('.nav-item.dropdown');
        if (dropdown) {
          dropdown.classList.add('disable-hover');
          // Αφαιρείς την κλάση μετά από λίγο (π.χ. 500ms)
          setTimeout(() => {
            dropdown.classList.remove('disable-hover');
          }, 500);
        }
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

                        <li className={`nav-item dropdown ${location.pathname.startsWith('/Products') ? 'active' : ''}`}    onClick={handleDropdownLinkClick}>
                            <Link className="nav-link" to="/Products">
                                Προϊόντα
                            </Link>
                            <div className="dropdown-menu">
                                <div className="dropdown-columns">
                                    <div className="dropdown-column">
                                        <Link
                                            to="/Products/Shower Gel"
                                            className={`nav-link ${location.pathname === '/Products/Shower Gel' ? 'active' : ''}`} onClick={handleDropdownLinkClick}
                                        >
                                            Shower Gel
                                        </Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link
                                            to="/Products/Shampoo"
                                            className={`nav-link ${location.pathname === '/Products/Shampoo' ? 'active' : ''}`}    onClick={handleDropdownLinkClick}
                                        >
                                            Shampoo
                                        </Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link
                                            to="/Products/Body Lotion"
                                            className={`nav-link ${location.pathname === '/Products/Body Lotion' ? 'active' : ''}`}  onClick={handleDropdownLinkClick}
                                        >
                                            Body Lotion
                                        </Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link
                                            to="/Products/Liquid Soap"
                                            className={`nav-link ${location.pathname === '/Products/Liquid Soap' ? 'active' : ''}`} onClick={handleDropdownLinkClick}
                                        >
                                            Liquid Soap
                                        </Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <Link
                                            to="/Products/Room Sprey"
                                            className={`nav-link ${location.pathname === '/Products/Room Sprey' ? 'active' : ''}`}  onClick={handleDropdownLinkClick} 
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

                <div
                    className="offcanvas offcanvas-start mobile-navbar"
                    id="staticBackdrop"
                    style={{ visibility: isOffcanvasShown ? 'visible' : 'hidden' }}
                >
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

                            <CustomLink to="/" onClick={handleCloseOffcanvas}
                            >Αρχική</CustomLink>

                            <li
                                className={`nav-item dropdown ${dropdownOpen ? 'show' : ''}`}
                                onClick={(e) => {
                                    // Απενεργοποίηση του default Link behavior
                                    e.preventDefault();
                                    toggleDropdown();
                                }}
                            >
                                <button className="nav-link btn-dropdown text-start" >
                                    Προϊόντα
                                    <IoIosArrowDown className={`dropdown-arrow ${dropdownOpen ? 'rotated' : ''}`} />
                                </button>

                                <div className="mobile-dropdown-menu">

                                    <div className="mobile-dropdown-columns">
                                        <Link
                                            to="/Products/"
                                            className={`nav-link ${location.pathname === '/Products/' ? 'active' : ''}`} onClick={handleCloseOffcanvas}
                                        >
                                            Όλα τα Προϊόντα
                                        </Link>
                                        <Link
                                            to="/Products/Shower Gel"
                                            className={`nav-link ${location.pathname === '/Products/Shower Gel' ? 'active' : ''}`} onClick={handleCloseOffcanvas}
                                        >
                                            Shower Gel
                                        </Link>
                                        <Link
                                            to="/Products/Shampoo"
                                            className={`nav-link ${location.pathname === '/Products/Shampoo' ? 'active' : ''}`} onClick={handleCloseOffcanvas}
                                        >
                                            Shampoo
                                        </Link>
                                        <Link
                                            to="/Products/Body Lotion"
                                            className={`nav-link ${location.pathname === '/Products/Body Lotion' ? 'active' : ''}`} onClick={handleCloseOffcanvas}
                                        >
                                            Body Lotion
                                        </Link>
                                        <Link
                                            to="/Products/Liquid Soap"
                                            className={`nav-link ${location.pathname === '/Products/Liquid Soap' ? 'active' : ''}`} onClick={handleCloseOffcanvas}
                                        >
                                            Liquid Soap
                                        </Link>
                                        <Link
                                            to="/Products/Room Sprey"
                                            className={`nav-link ${location.pathname === '/Products/Room Sprey' ? 'active' : ''}`} onClick={handleCloseOffcanvas}
                                        >
                                            Room Sprey
                                        </Link>
                                    </div>
                                </div>
                            </li>
                            <CustomLink to="/OurCompany" onClick={handleCloseOffcanvas}>Η Εταιρεία μας</CustomLink>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}