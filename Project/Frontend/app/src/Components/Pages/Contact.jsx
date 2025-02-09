import React from 'react'
import './Contact.css';
import TopNavbar from '../Navbars/TopNavbar'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'
const Contact = () => {
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <Footer />
            </div>
        </>
    )
}
export default Contact