import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../SmallComponents/SearchBar';
import './TopNavbar.css';
import { SlBasket } from "react-icons/sl";
import { CiHeart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { BsTruck } from "react-icons/bs";


const TopNavbar = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/Login');
    };
    return (
        <div className='topbar'>
            {/* Info Section */}
            <div className="info-section">
                <div className="details mb-3 text-center">
                    <span>
                        Δωρεάν Μεταφορικά πάνω από 29€ | Πανελλαδική Κάλυψη <BsTruck size={"1.3rem"} />
                    </span>
                    <span>
                        Τηλ. Παραγγελίες 📞 +30 210 123 4567 | ✉ info@example.com
                    </span>
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
                    <form className="d-flex searchbar" role="search" style={{ marginLeft: "1.5rem" }}>
                        <SearchBar />
                        <button className="btn btn-outline-success ms-2" type="button">
                            Search
                        </button>
                    </form>

                    {/* Icons Section */}
                    <div className="icons">
                        <CiUser className="Icons" onClick={handleLoginClick} />
                        <CiHeart className="Icons" />
                        <SlBasket className="Icons" />
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default TopNavbar;
