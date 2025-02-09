import React from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import SearchBar from '../SmallComponents/SearchBar';
import './TopNavbar.css';
import { BsCartFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { BsTruck } from "react-icons/bs";

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
                    <Link className="logo" to="/" style={{color: "red"}}
                    onClick={() => navigate("/Login")}>
                        Logo
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
                        <FaUser
                            className={`Icons ${location.pathname === "/Login" ? "active-icon" : ""}`}
                            onClick={() => navigate("/Login")}
                        />
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
