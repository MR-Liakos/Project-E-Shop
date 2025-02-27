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
    console.log(isLoggedInLocal);
    
    if (isLoggedInLocal){
        useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const ordersResponse = await api.get('api/orders/', { params: { paid: false } });
                    console.log(ordersResponse.data[0].order_items.length == 0);
                    
                         
                    if (ordersResponse.data[0].order_items.length == 0) {
                        return setisEmpty(true)
                    } else () => { return setisEmpty(false) }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
    
            fetchUserData();
        }, []);
    } else () => { return setisEmpty(false) }
    


    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
            {isEmpty == false? (
                <div>
                    <CartItems />
                </div>
                
            ) : (
                <div className='c-cartcontainer py-5 d-flex flex-column align-items-center justify-content-center text-center'style={{marginTop: "5rem"}}>
                <h4 className='fs-4 fw-bold mb-3'>Το καλάθι σου είναι άδειο</h4>
                <FaCartPlus size={"3rem"} className="text-secondary " />
            </div>
            )};
                <div className='c-cartcontainer py-5 d-flex flex-column align-items-center justify-content-center text-center'>
                    <h4 className='fs-4 fw-bold mb-3'>Το καλάθι σου είναι άδειο</h4>
                    <FaCartPlus size={"3rem"} className="text-secondary " />
                </div>
                <Footer />
            </div>
        </>
    )
}
export default Cart