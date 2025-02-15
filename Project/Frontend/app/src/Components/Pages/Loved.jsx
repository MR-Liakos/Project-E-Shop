import React, { useEffect, useState } from "react";
import TopNavbar from "../Navbars/TopNavbar";
import Navbar from "../Navbars/Navbar";
import Footer from "../Navbars/Footer";
import api from "../../endpoints/api";

const Loved = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [agaph, setagaph] = useState([]);


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
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <h5 className="order-title">AGAPH MONO: {agaph.favorites}</h5>
                <Footer/>
            </div>
        </>
    );
};
export default Loved;
