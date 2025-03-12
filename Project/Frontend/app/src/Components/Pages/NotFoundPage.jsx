import React from 'react'
import { BiDizzy } from "react-icons/bi";
import { Link } from 'react-router-dom';
import TopNavbar from '../Navbars/TopNavbar'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'
import './NotFoundPage.css'
import { useEffect, useState } from 'react';
const NotFoundPage = () => {
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
        window.addEventListener("scroll", handleScroll, { passive: true });


        // Remove the listener when the component unmounts
        return () => {
            window.removeEventListener("scroll", handleScroll, { passive: true });
        };
    }, []);
    return (
        <>
            <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
                <TopNavbar />
                <Navbar />
            </div>
            <div className="home-container">
                <div className="d-flex flex-column justify-content-center align-items-center vh-100 gap-3  text-center text-black" >
                    <h1 className='mb-3'>Η σελίδα δεν βρέθηκε <BiDizzy size={"4rem"} /></h1>
                    <p>Η σελίδα που προσπαθείτε να συνδεθείτε δεν υπάρχει</p>
                    <Link to="/" className='btn c-nobtn btn-lg rounded-pill px-4 py-2'>Πίσω στην αρχική</Link>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default NotFoundPage