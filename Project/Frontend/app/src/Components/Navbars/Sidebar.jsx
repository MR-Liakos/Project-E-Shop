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
      const response = await api2.post("api/logout/");
      if (response.status === 200) {
        alert("Logged out successfully!");
        window.location.href = "/login";
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
            <VscAccount color="black" size={"2rem"} /> Λογαριασμός
          </button>
        </li>
        <li className="nav-item-costum">
          <button
            className={`nav-link-custom ${isActive("MyFavourites") ? "active" : ""}`}
            onClick={() => navigate("/Account/MyFavourites")}
          >
            <FaRegHeart color="black" size={"2rem"} /> Αγαπημένα
          </button>
        </li>
        <li className="nav-item-costum">
          <button
            className={`nav-link-custom  ${isActive("MyReviews") ? "active" : ""}`}
            onClick={() => navigate("/Account/MyReviews")}
          >
            <FaRegStar color="black" size={"2rem"} /> Αξιολογήσεις
          </button>
        </li>
        <li className="nav-item-costum">
          <button
            className={`nav-link-custom  ${isActive("MyOrders") ? "active" : ""}`}
            onClick={() => navigate("/Account/MyOrders")}
          >
            <FaClipboardList color="black" size={"2rem"} /> Παραγγελίες
          </button>
        </li>
        <li className="nav-item-costum">
          <button
            className={`nav-link-custom  ${isActive("MySettings") ? "active" : ""}`}
            onClick={() => navigate("/Account/MySettings")}
          >
            <IoSettingsOutline color="black" size={"2rem"} /> Ρυθμίσεις
          </button>
        </li>
      </ul>
      <div className="logout-container">
        <button
          type="button"
          className="btn btn-secondary-emphasis"
          onClick={handleLogout}
        >
          <IoLogOutOutline size={"1.4rem"}/> Αποσύνδεση
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
