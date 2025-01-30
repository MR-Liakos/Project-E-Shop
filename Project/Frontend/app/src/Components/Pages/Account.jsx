import React from 'react'
import { FaCartPlus } from "react-icons/fa";
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import { VscAccount } from "react-icons/vsc";

const Account = () => {
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#" ><VscAccount /> Λογαριασμός</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Αγαπημένα</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Καλάθι</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Παραγγελίες</a>
                    </li>
                    <li class="nav-item">
                        <button type="button" class="btn btn-outline-danger">Αποσύνδεση</button>
                    </li>
                </ul>
                <Footer />
            </div>


        </>
    )
}
export default Account