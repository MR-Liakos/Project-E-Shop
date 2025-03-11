import React from 'react';
import Footer from '../Navbars/Footer';
import Navbar from '../Navbars/Navbar';
import TopNavbar from '../Navbars/TopNavbar';
import LoginForm from '../SmallComponents/LoginForm';
import Register from '../SmallComponents/Register';
import './Login.css'
import { useEffect, useState } from 'react';
const Login = () => {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Calculate the halfway point of the initial visible page height
            const initialPageHeight = window.innerHeight;

            const twentyPercentPoint = initialPageHeight * 0.20; // 20%

            // Get the current scroll position
            const scrollPosition = window.scrollY;

            // Check if the scroll position is past the halfway point
            if (scrollPosition > twentyPercentPoint) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        // Add the scroll event listener
        window.addEventListener("scroll", handleScroll);

        // Remove the listener when the component unmounts
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <>
            <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
                <TopNavbar />
                <Navbar />
            </div>
            <div className="home-container">
                <div className="container d-flex justify-content-between align-items-center flex-wrap" style={{ minHeight: "80vh" }}>
                    <div className='c-Logincontainer container d-flex my-3'>
                        <div className="login-section" >
                            <LoginForm />
                        </div>
                        <div className='divider'></div>
                        <div className="register-section" >
                            <Register />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Login;