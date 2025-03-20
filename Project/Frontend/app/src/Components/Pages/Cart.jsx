import React, { useState, useEffect } from 'react';
import { FaCartPlus } from "react-icons/fa";
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import CartItems from '../SmallComponents/CartItems';
import api from '../../endpoints/api';

const Cart = () => {

    const [isEmpty, setisEmpty] = useState([]);
    const isLoggedInLocal = localStorage.getItem("loggedIn")
    //console.log(isLoggedInLocal);

    if (isLoggedInLocal) {
        useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const ordersResponse = await api.get('api/orders/', { params: { paid: false } });
                    //console.log(ordersResponse.data.length);
                    if (ordersResponse.data.length == 0 || ordersResponse.data[0].order_items.length == 0) {
                        return setisEmpty(true)
                    } else () => { return setisEmpty(false) }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchUserData();
        }, []);
    } else () => { return setisEmpty(false) }
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
                {isEmpty == false ? (
                    <div className='cart-container' >
                        <CartItems />
                    </div>
                ) : (
                    <div className='c-cartcontainer py-5 d-flex flex-column align-items-center justify-content-center text-center' style={{ marginTop: "5rem" }}>
                        <h4 className='fs-4 fw-bold mb-3'>Το καλάθι σου είναι άδειο</h4>
                        <FaCartPlus size={"3rem"} className="text-secondary mb-5" />
                    </div>
                )}
                <Footer />
            </div>
        </>
    )
}
export default Cart