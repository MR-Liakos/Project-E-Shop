import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../SmallComponents/SearchBar';
import './TopNavbar.css';
import { BsCartFill } from "react-icons/bs";
import { FaHeart, FaUser } from "react-icons/fa";
import EshopLogo from './../../assets/logoo.png';
import { IoLogOutOutline } from "react-icons/io5";
import api2 from "../../endpoints/api2";
import api from '../../endpoints/api';

const TopNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await api2.post("api/logout/");
            if (response.status === 200) {
                alert("Αποσυνδεθήκατε επιτυχώς!");
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Αποτυχία αποσύνδεσης", error);
        }
    };

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await api.get(`api/authenticated/`);
                setAuthenticated(true);
            } catch (err) {
                setAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuthentication();
    }, []);

    const handleUserClick = () => {
        if (!authenticated) {
            navigate("/LovedAuth");
        } else {
            setShowDropdown(!showDropdown);
        }
    };

    return (
        <div className='topbar'>
            <nav className="navbar navbar-expand-lg bg-body-tertiary top-navbar">
                <div className="container-fluid navbar-container">
                    <Link to="/">
                        <img
                            src={EshopLogo}
                            alt="Eshop Logo"
                            className="logo"
                        />
                    </Link>

                    <form className="d-flex searchbar" role="search" style={{ marginLeft: "1.5rem" }}>
                        <SearchBar />
                        <button className="btn-search ms-2" type="button">
                            Search
                        </button>
                    </form>

                    <div className="icons">
                        <div className="btn-group custom-user-menu">
                            <FaUser
                                className={`Icons user-icon ${showDropdown ? 'active-icon' : ''}`}
                                onClick={handleUserClick}
                            />
                            {authenticated && showDropdown && (
                                <ul className="dropdown-menu c-menu show">
                                    <Link className="dropdown-item c-drop-item" to="/Account/MyAccount">
                                        <span className="menu-text">👤 Λογαριασμός</span>
                                    </Link>
                                    <Link className="dropdown-item c-drop-item" to="/Account/MyFavourites">
                                        <span className="menu-text">❤️ Αγαπημένα</span>
                                    </Link>
                                    <Link className="dropdown-item c-drop-item" to="/Account/MyReviews">
                                        <span className="menu-text">⭐ Αξιολογήσεις</span>
                                    </Link>
                                    <Link className="dropdown-item c-drop-item" to="/Account/MyOrders">
                                        <span className="menu-text">📦 Παραγγελίες</span>
                                    </Link>
                                    <Link className="dropdown-item c-drop-item" to="/Account/MySettings">
                                        <span className="menu-text">⚙️ Ρυθμίσεις</span>
                                    </Link>
                                    <Link className="dropdown-item c-drop-item" onClick={handleLogout}>
                                        <span className="menu-text"><IoLogOutOutline size={"1.4rem"} />Έξοδος</span>
                                    </Link>
                                </ul>
                            )}
                        </div>
                        <FaHeart
                            className={`Icons ${location.pathname === "/Account/MyFavourites" ? "active-icon" : ""}`}
                            onClick={() => navigate("/Account/MyFavourites")}
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