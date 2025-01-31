import React, { useEffect, useState } from 'react'
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import CartContainer from '../SmallComponents/CartContainer';
import api from "../../endpoints/api"



const Afroloutra = () => {
    const [afross, setAfros] = useState([])

    useEffect(function(){
        api.get("products").then(res =>{console.log(res.data)
        const filteredProducts = res.data.filter(product => product.category === "Body Lotion");
        setAfros(filteredProducts); // Set the filtered products kai pernav mono ta BODYLOTIONS
        })
        .catch(err => {console.log(err.message)})
    }, [])

    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <CartContainer products={afross} />

                
                <Footer />
            </div>
        </>
    )
}
export default Afroloutra