import React from 'react';
import Footer from '../Navbars/Footer';
import Navbar from '../Navbars/Navbar';
import TopNavbar from '../Navbars/TopNavbar';
import LoginForm from '../SmallComponents/LoginForm';
import Register from '../SmallComponents/Register';

const Login = () => {
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <div className="container d-flex justify-content-between align-items-center flex-wrap" style={{ minHeight: "80vh" }}>
                    <div className="login-section" style={{ flex: 1, maxWidth: "45%" }}>
                        <LoginForm />
                    </div>
                    <div className="register-section" style={{ flex: 1, maxWidth: "45%" }}>
                        <Register />
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Login;
