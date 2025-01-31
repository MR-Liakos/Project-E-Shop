import React from 'react'
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import AccountManage from '../SmallComponents/AccountManage';
import Sidebar from '../Navbars/Sidebar';
import './Account.css'

const Account = () => {
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <Sidebar/>
                <AccountManage />
                <Footer />
            </div>
        </>
    )
}
export default Account