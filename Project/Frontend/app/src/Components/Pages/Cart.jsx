import React from 'react'
import { FaCartPlus } from "react-icons/fa";
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
const Cart = () => {
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <div className='c-cartcontainer py-5 d-flex flex-column align-items-center justify-content-center text-center'style={{marginTop: "5rem"}}>
                    <h4 className='fs-4 fw-bold mb-3'>Το καλάθι σου είναι άδειο</h4>
                    <FaCartPlus size={"3rem"} className="text-secondary " />
                </div>
                <Footer />
            </div>
        </>
    )
}
export default Cart