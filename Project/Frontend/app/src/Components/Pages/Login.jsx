import React from 'react'
import Footer from '../Navbars/Footer'
import Navbar from '../Navbars/Navbar'
import TopNavbar from '../Navbars/TopNavbar'
import LoginRegister from '../SmallComponents/LoginRegister'
const Login = () => {
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">

                <LoginRegister></LoginRegister>
                <Footer />
            </div>
        </>
    )
}

export default Login