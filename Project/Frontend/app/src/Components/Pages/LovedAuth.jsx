import React from 'react'
import TopNavbar from '../Navbars/TopNavbar'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'
import LoginLoved from '../SmallComponents/LoginLoved'
export default function LovedAuth() {

  return (
    <>
      <TopNavbar />
      <Navbar />
      <div className="home-container">
        <LoginLoved/>
        <Footer/>
      </div>
    </>
  )
}
