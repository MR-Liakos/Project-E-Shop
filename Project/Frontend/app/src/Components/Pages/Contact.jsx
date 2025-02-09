import React from 'react'
import './Contact.css';
import TopNavbar from '../Navbars/TopNavbar'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'
import ContactForm from '../SmallComponents/ContactForm';
const Contact = () => {
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <ContactForm></ContactForm>
                <Footer />
            </div>
        </>
    )
}
export default Contact