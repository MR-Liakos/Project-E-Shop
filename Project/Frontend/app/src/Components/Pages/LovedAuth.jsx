import React from 'react'
import TopNavbar from '../Navbars/TopNavbar'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'
import LoginLoved from '../SmallComponents/LoginLoved'
import { useEffect, useState } from 'react'
export default function LovedAuth() {

  const [isSticky, setIsSticky] = useState(false);
  const isLoggedInLocal = localStorage.getItem("loggedIn");
  
  if (isLoggedInLocal == 'true') {
    window.location.href = "http://localhost:5173/";
    return null;
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
        <LoginLoved />
        <Footer />
      </div>
    </>
  )
}
