import React, { useEffect, useState } from "react";
import TopNavbar from "../Navbars/TopNavbar";
import Navbar from "../Navbars/Navbar";
import Footer from "../Navbars/Footer";
import api from "../../endpoints/api";
const Loved = () => {


    return (
        <>

                <TopNavbar />
                <Navbar />

            <div className="home-container">
                <h1 className="order-title">AGAPH MONO:</h1>
                <Footer />
            </div>
        </>
    );
};
export default Loved;
