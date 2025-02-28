import React, { useState, useEffect } from "react";
import Navbar from "../Navbars/Navbar";
import TopNavbar from "../Navbars/TopNavbar";
import Footer from "../Navbars/Footer";
import './Home.css';
import imga from './../../assets/1.jpg'
import imgb from './../../assets/2.jpg'
import imgc from './../../assets/3.jpg'
import imgd from './../../assets/4.jpg'

export default function Home() {
    const images = [
        imga,
        imgb,
        imgc,
        imgd,
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const nextSlide = () => {
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <div className="carousel-container">
                    <button onClick={prevSlide} className="carousel-button left-button">
                        &#10094;
                    </button>
                    <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} className="carousel-image" />
                    <button onClick={nextSlide} className="carousel-button right-button">
                        &#10095;
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
}