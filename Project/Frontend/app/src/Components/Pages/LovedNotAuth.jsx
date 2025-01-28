import React from 'react'
import TopNavbar from '../Navbars/TopNavbar'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'

export default function LovedNotAuth(){
  
    return (
    <>  
        <TopNavbar />
        <Navbar />
        <div className="home-container">
            <Footer></Footer>
        </div>
    </>
  )
}
