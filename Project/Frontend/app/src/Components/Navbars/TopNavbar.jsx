import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../SmallComponents/SearchBar';
import './TopNavbar.css';
import { BsCartFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import EshopLogo from './../../assets/logoo.png';
const TopNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className='topbar'>
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
                                height: '100px',
                                display: 'block',
                                backgroundColor: "white",
                                padding: "0",
                                margin: "0",
                                objectFit: "contain",
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
                            <FaUser className="Icons user-icon"
                                data-bs-toggle="dropdown"
                                aria-expanded="false" />
                            <ul className="dropdown-menu c-menu">
                                <Link className="dropdown-item c-drop-item" to="/Account/MyAccount">
                                    <span className="menu-text">👤 Λογαριασμός</span>
                                </Link>
                                <Link className="dropdown-item c-drop-item" to="/Account/MyFavourites">
                                    <span className="menu-text">❤️Αγαπημένα</span>
                                </Link>
                                <Link className="dropdown-item c-drop-item" to="/Account/MyReviews">
                                    <span className="menu-text">⭐Αξιολογήσεις</span>
                                </Link>
                                <Link className="dropdown-item c-drop-item" to="/Account/MyOrders">
                                    <span className="menu-text">📦Παραγγελίες</span>
                                </Link>
                                <Link className="dropdown-item c-drop-item" to="/Account/MySettings">
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
