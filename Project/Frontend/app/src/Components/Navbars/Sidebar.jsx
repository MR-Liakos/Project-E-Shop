import React from "react";
import { VscAccount } from "react-icons/vsc";
import { FaRegHeart, FaRegStar, FaClipboardList } from "react-icons/fa";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import api2 from "../../endpoints/api2";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (pathSegment) => location.pathname.includes(pathSegment);

  const handleLogout = async () => {
    try {
      localStorage.setItem('loggedIn', 'false');
      const response = await api2.post("api/logout/");
      if (response.status === 200) {
        
        window.location.href = "/LovedAuth";
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="c-sidebar">
      <ul className="nav flex-column">
        <li className="nav-item-costum">
          <button
            className={`nav-link-custom ${isActive("MyAccount") ? "active" : ""}`}
            onClick={() => navigate("/Account/MyAccount")}
          >
            <VscAccount color="black"  className="sidebar-icon" /> <span className="side-text">Λογαριασμός</span>
          </button>
        </li>
        <li className="nav-item-costum">
          <button
            className={`nav-link-custom ${isActive("MyFavourites") ? "active" : ""}`}
            onClick={() => navigate("/Account/MyFavourites")}
          >
            <FaRegHeart color="black"  className="sidebar-icon" /> <span className="side-text">Αγαπημένα</span> 
          </button>
        </li>
        <li className="nav-item-costum">
          <button
            className={`nav-link-custom  ${isActive("MyReviews") ? "active" : ""}`}
            onClick={() => navigate("/Account/MyReviews")}
          >
            <FaRegStar color="black"  className="sidebar-icon" /> <span className="side-text ">Αξιολογήσεις</span>
          </button>
        </li>
        <li className="nav-item-costum">
          <button
            className={`nav-link-custom  ${isActive("MyOrders") ? "active" : ""}`}
            onClick={() => navigate("/Account/MyOrders")}
          >
            <FaClipboardList color="black" className="sidebar-icon"  /> <span className="side-text">Παραγγελίες</span>
          </button>
        </li>
        <li className="nav-item-costum">
          <button
            className={`nav-link-custom  ${isActive("MySettings") ? "active" : ""}`}
            onClick={() => navigate("/Account/MySettings")}
          >
            <IoSettingsOutline color="black" className="sidebar-icon"  /> <span className="side-text">Ρυθμίσεις</span>
          </button>
        </li>
      </ul>
      <div className="logout-container">
        <button
          type="button"
          className="btn btn-secondary-emphasis"
          onClick={handleLogout}
        >
          <IoLogOutOutline className="sidebar-icon" /> <span className="side-text">Αποσύνδεση</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
