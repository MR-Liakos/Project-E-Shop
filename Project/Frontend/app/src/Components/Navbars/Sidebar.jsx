import React from 'react'
import { VscAccount } from "react-icons/vsc";
import { FaRegHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { TiShoppingCart } from "react-icons/ti";
import { FaClipboardList } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import './Sidebar.css'
import { IoSettingsOutline } from "react-icons/io5";
import api2 from '../../endpoints/api2';

const Sidebar = () => {

    const handleLogout = async () => {
        try {
            const response = await api2.post("api/logout/");
    
            if (response.status === 200) {
                alert("Logged out successfully!");
                // Redirect to login or home page
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Logout failed", error);
        }
    };
    return (
        <>
            <div className='c-sidebar'>
                <ul className="nav flex-column ">
                    <li className="nav-item-costum">
                        <Link className="nav-link active" aria-current="page" to="#" ><VscAccount color='black' size={"2rem"} /> Λογαριασμός</Link>
                    </li>
                    <li className="nav-item-costum">
                        <Link className="nav-link" to="#"> <FaRegHeart color='black' size={"2rem"} />Αγαπημένα</Link>
                    </li>
                    <li className="nav-item-costum">
                        <Link className="nav-link" to="#"><TiShoppingCart color='black' size={"2rem"} />Καλάθι</Link>
                    </li>
                    <li className="nav-item-costum">
                        <Link className="nav-link" to="/Orders"> <FaClipboardList color='black' size={"2rem"} />Παραγγελίες</Link>
                    </li>
                    <li className="nav-item-costum">
                        <Link className="nav-link" to="#"> <IoSettingsOutline color='black' size={"2rem"} />Ρυθμίσεις</Link>
                    </li>
                </ul>
                <div className="logout-container">
                    <button type="button" className="btn  btn-secondary-emphasis" onClick={handleLogout}> 
                        <IoLogOutOutline /> Αποσύνδεση
                    </button>
                </div>
            </div>
        </>
    )
}
export default Sidebar