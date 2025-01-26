import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../SmallComponents/SearchBar';
import './TopNavbar.css';
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { SlBasket } from "react-icons/sl";

const TopNavbar = () => {
    return (
        <div className='topbar'>
            {/* Info Section */}
            <div className="info-section" >
                <div className="details">
                    <p>Τηλ. Παραγγελίες 📞 +30 210 123 4567 | ✉ info@example.com</p>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="navbar navbar-expand-lg bg-body-tertiary top-navbar">
                <div className="container-fluid navbar-container">
                    {/* Logo */}
                    <Link className="navbar-brand" to="/">
                        Logo
                    </Link>

                    {/* Search Bar */}
                    <form className="d-flex searchbar" role="search" style={{marginLeft: "1.5rem"}}>
                        <SearchBar />
                        <button className="btn btn-outline-success ms-2" type="button">
                            Search
                        </button>
                    </form>

                    {/* Icons Section */}
                    <div className="icons">
                        <FaUser className="Icons" />
                        <FaHeart className="Icons" />
                        <SlBasket className="Icons" />
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default TopNavbar;
