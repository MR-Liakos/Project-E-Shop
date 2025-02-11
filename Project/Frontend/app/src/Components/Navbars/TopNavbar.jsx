import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../SmallComponents/SearchBar';
import './TopNavbar.css';
import { BsCartFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import EshopLogo from './../../assets/EshopLogo.png';
const TopNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className='topbar'>
            {/* Info Section */}


            {/* Main Navbar */}
            <nav className="navbar navbar-expand-lg bg-body-tertiary top-navbar">
                <div className="container-fluid navbar-container">
                    {/* Logo */}
                    <Link
                        className="logo"
                        to="/"
                        onClick={() => navigate("/Login")}
                    >
                        <img
                            src={EshopLogo}
                            alt="Eshop Logo"
                            style={{
                                height: '100px', // Adjust based on your logo size
                                display: 'block',
                                backgroundClip: "black",
                                padding: "0",
                                margin: "0 "
                            }}
                        />
                    </Link>

                    {/* Search Bar */}
                    <form className="d-flex searchbar" role="search" style={{ marginLeft: "1.5rem" }}>
                        <SearchBar />
                        <button className="btn-search ms-2" type="button">
                            Search
                        </button>

                    </form>

                    {/* Icons Section */}
                    <div className="icons">
                        <div className="btn-group custom-user-menu">
                            <button
                                type="button"
                                className="user-menu-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <FaUser className="user-icon" />
                            </button>
                            <ul className="dropdown-menu">
                                <Link className="dropdown-item" to="/Account/MyAccount">
                                    <span className="menu-text">👤 Λογαριασμός</span>
                                </Link>
                                <Link className="dropdown-item" to="/Account/MyFavourites">
                                    <span className="menu-text">❤️Αγαπημένα</span>
                                </Link>
                                <Link className="dropdown-item" to="/Account/MyReviews">
                                    <span className="menu-text">⭐Αξιολογήσεις</span>
                                </Link>
                                <Link className="dropdown-item" to="/Account/MyOrders">
                                    <span className="menu-text">📦Παραγγελίες</span>
                                </Link>
                                <Link className="dropdown-item" to="/Account/MySettings">
                                    <span className="menu-text">⚙️Ρυθμίσεις</span>
                                </Link>
                            </ul>
                        </div>
                        <FaHeart
                            className={`Icons ${location.pathname === "/LovedAuth" ? "active-icon" : ""}`}
                            onClick={() => navigate("/LovedAuth")}
                        />
                        <BsCartFill
                            className={`Icons ${location.pathname === "/Cart" ? "active-icon" : ""}`}
                            onClick={() => navigate("/Cart")}
                        />
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default TopNavbar;
