import React from 'react'
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import AccountManage from '../SmallComponents/AccountManage';
import { VscAccount } from "react-icons/vsc";
import { FaRegHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { TiShoppingCart } from "react-icons/ti";
import { FaClipboardList } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import './Account.css'



const Account = () => {
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <div class="split-container">
                    <ul className="nav flex-column">
                        <li className="nav-item-costume">
                            <Link className="nav-link active" aria-current="page" to="#" ><VscAccount /> Λογαριασμός</Link>
                        </li>
                        <li className="nav-item-costume">
                            <Link className="nav-link" to="#"> <FaRegHeart /> Αγαπημένα</Link>
                        </li>
                        <li className="nav-item-costume">
                            <Link className="nav-link" to="#"><TiShoppingCart /> Καλάθι</Link>
                        </li>
                        <li className="nav-item-costume">
                            <Link className="nav-link" to="#"> <FaClipboardList /> Παραγγελίες</Link>
                        </li>
                        <li className="nav-item-costume">
                            <button type="button" className="btn btn-outline-danger"> <IoLogOutOutline /> Αποσύνδεση</button>
                        </li>
                    </ul>
                    <AccountManage />
                </div>

                
                <Footer />
            </div>


        </>
    )
}
export default Account