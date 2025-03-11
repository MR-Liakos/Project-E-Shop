import React, { useState, useEffect } from "react";
import Navbar from "../Navbars/Navbar";
import TopNavbar from "../Navbars/TopNavbar";
import Footer from "../Navbars/Footer";
import './Home.css';
import imga from './../../assets/a.jpg'
import imgb from './../../assets/b.jpg'
import imgc from './../../assets/EshopLogo.png'

export default function Home() {
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

                <div className="photo-container photo-container-1 my-5">
                    <img src={imga} alt={imgc} className="home-imges" />
                    <div className="text-container">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus alias necessitatibus architecto nisi dolorem iure minima temporibus amet nemo esse?</p>
                    </div>
                </div>
                <div className="photo-container photo-container-2 my-5">
                    <div className="text-container">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus alias necessitatibus architecto nisi dolorem iure minima temporibus amet nemo esse?</p>
                    </div>
                    <img src={imgb} alt={imgc} className="home-imges" />
                </div>

                <Footer />
            </div>
        </>
    );
}