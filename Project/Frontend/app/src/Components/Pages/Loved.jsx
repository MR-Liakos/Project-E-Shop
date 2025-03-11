import React, { useEffect, useState } from "react";
import TopNavbar from "../Navbars/TopNavbar";
import Navbar from "../Navbars/Navbar";
import Footer from "../Navbars/Footer";
import api from "../../endpoints/api";
const Loved = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [agaph, setagaph] = useState([]);
    const [isSticky, setIsSticky] = useState(false);


    useEffect(function () {
        //setIsLoading(true)

        api.get(`api/user/`).then(res => {
            //console.log(res.data);
            setagaph(res.data);  // ✅ Correct - Store the array properly
            setIsLoading(true);
        })
            .catch(err => {
                console.log("Error sto Orders", err.message,);
                setIsLoading(false)

            })

    }, [])
    if (isLoading) {
        // Return a loading spinner or placeholder while checking auth status
        return <div>Loading...</div>;
    }

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
                <h5 className="order-title">AGAPH MONO: {agaph.favorites}</h5>
                <Footer />
            </div>
        </>
    );
};
export default Loved;
