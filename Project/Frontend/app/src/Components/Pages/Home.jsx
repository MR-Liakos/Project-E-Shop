import React, { useState, useEffect } from "react";
import Navbar from "../Navbars/Navbar";
import TopNavbar from "../Navbars/TopNavbar";
import Footer from "../Navbars/Footer";
import './Home.css';
import imga from './../../assets/a.jpg'
import imgb from './../../assets/b.jpg'
import imgc from './../../assets/EshopLogo.png'

export default function Home() {

    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">

                <div className="photo-container my-5">
                    <img src={imga} alt={imgc} className="home-imges" />
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus alias necessitatibus architecto nisi dolorem iure minima temporibus amet nemo esse?</p>
                </div>
                <div className="photo-container my-5">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus alias necessitatibus architecto nisi dolorem iure minima temporibus amet nemo esse?</p>
                    <img src={imgb} alt={imgc} className="home-imges" />
                </div>

                <Footer />
            </div>
        </>
    );
}