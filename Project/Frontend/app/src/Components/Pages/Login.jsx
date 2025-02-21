import React from 'react';
import Footer from '../Navbars/Footer';
import Navbar from '../Navbars/Navbar';
import TopNavbar from '../Navbars/TopNavbar';
import LoginForm from '../SmallComponents/LoginForm';
import Register from '../SmallComponents/Register';
import './Login.css'

const Login = () => {
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <div className="container d-flex justify-content-between align-items-center flex-wrap" style={{ minHeight: "80vh" }}>
                    <div className='c-Logincontainer container d-flex'>
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