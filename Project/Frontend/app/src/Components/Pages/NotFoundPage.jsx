import React from 'react'
import { BiDizzy } from "react-icons/bi";
import { Link } from 'react-router-dom';
import TopNavbar from '../Navbars/TopNavbar'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'
import './NotFoundPage.css'
const NotFoundPage = () => {
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <div className="d-flex flex-column justify-content-center align-items-center vh-100 gap-3  text-center text-black" >
                    <h1 className='mb-3'>Η σελίδα δεν βρέθηκε <BiDizzy size={"4rem"}/></h1>
                    <p>Η σελίδα που προσπαθείτε να συνδεθείτε δεν υπάρχει</p>
                    <Link to="/" className='btn c-nobtn btn-lg rounded-pill px-4 py-2'>Πίσω στην αρχική</Link>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default NotFoundPage