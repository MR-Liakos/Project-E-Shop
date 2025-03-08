// TopNavbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../SmallComponents/SearchBar';
import './TopNavbar.css';
import { BsCartFill } from "react-icons/bs";
import { FaHeart, FaUser } from "react-icons/fa";
import EshopLogo from './../../assets/logoo.png';
import { IoLogOutOutline } from "react-icons/io5";
import api2 from "../../endpoints/api2";
import api from '../../endpoints/api';
import { FiSearch } from "react-icons/fi";
import { BASE_URL } from '../../endpoints/api2'
import { use } from "react";

const TopNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const isLoggedInLocal = localStorage.getItem("loggedIn");
  const [orders, setOrders] = useState([]); //??????????
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [numCartItems, setnumCartItems] = useState();

  const handleLogout = async () => {
    try {
      const response = await api2.post("api/logout/");
      localStorage.setItem('loggedIn', 'false');
      if (response.status === 200) {
        alert("Αποσυνδεθήκατε επιτυχώς!");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Αποτυχία αποσύνδεσης", error);
    }
  };
  const checkAuthentication = async () => {
    try {
      if (!isLoggedInLocal || isLoggedInLocal === "false") {
        setAuthenticated(false);
        setIsLoading(false);
        return;
      }
      const response = await api.get("api/authenticated/");
      const response2 = await api.get("api/orders/");

      console.log(response2.data);
      const unpaidOrder = response2.data.find(order => !order.paid);
      console.log(unpaidOrder.order_items.length);
      setnumCartItems(unpaidOrder.order_items.length)


      setAuthenticated(true);
    } catch (err) {
      setAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    checkAuthentication();
  }, [isLoggedInLocal]);

  const handleUserClick = () => {
    if (!authenticated) {
      navigate("/LovedAuth");
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  // Fetching Products for SearchBar
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api2.get("products/");
        setAllProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err.message);
      }
    };
    fetchProducts();
  }, []);

  // Handle search filtering
  useEffect(() => {
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, allProducts]);

  // Handle search input change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const toggleSearchModal = () => setShowSearchModal(!showSearchModal);

  useEffect(() => {
    if (showSearchModal) {
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    } else {
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
    return () => {
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    };
  }, [showSearchModal]);

  return (
    <div className='topbar'>
      <nav className="navbar navbar-expand-lg bg-body-tertiary top-navbar">
        <div className="container-fluid navbar-container topbar-wrapper">
          <Link to="/">
            <img
              src={EshopLogo}
              alt="Eshop Logo"
              className="logo"
            />
          </Link>

          <form className="d-flex searchbar" role="search" onSubmit={(e) => e.preventDefault()}>
            {/* Desktop Search */}
            <div className="desktop-search">
              <SearchBar value={searchTerm} onChange={handleSearchChange} />
              {searchTerm && (
                <div className="search-results-dropdown">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="search-result-item"
                      onClick={() => navigate(`/product/${product.slug}`)}>
                      <img src={`${BASE_URL}${product.image}`} alt={product.name} />
                      <span>{product.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <button className="btn-search ms-2" type="button">
                Search
              </button>
            </div>

            {/* Mobile Search Icon */}
            <FiSearch
              className="mobile-search-icon"
              onClick={toggleSearchModal}
            />
          </form>

          {/* Search Modal */}
          {showSearchModal && (
            <div className="search-modal-overlay">
              <div className="search-modal">
                <div className="modal-header" >
                  <h3>Αναζήτηση</h3>
                  <button className="close-modal" onClick={toggleSearchModal}>
                    &times;
                  </button>
                </div>
                <div className="modal-body c-modalbody">

                  <SearchBar value={searchTerm} onChange={handleSearchChange} />
                  {searchTerm && (

                    <div className="search-results-dropdown-mobile">
                      {filteredProducts.map(product => (
                        <div
                          key={product.id}
                          className="search-result-item-mobile"
                          onClick={() => navigate(`/product/${product.slug}`)}
                        >
                          <div className="item-content-wrapper">
                            {/* Εικόνα - Αριστερά */}
                            <img
                              src={`${BASE_URL}${product.image}`}
                              alt={product.name}
                              className="product-image-mobile"
                            />

                            {/* Όνομα - Κέντρο */}
                            <span className="product-name-mobile">{product.name}</span>

                            {/* Τιμή - Δεξιά */}
                            <span className="product-price-mobile">{product.price}€</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button className="btn-search fs-5 search-mobile-btn" onClick={toggleSearchModal}>
                    Search
                  </button>
                </div>
              </div>
            </div>
          )}



          <div className="icons">
            <div className="btn-group custom-user-menu">
              <FaUser
                className={`Icons user-icon ${showDropdown ? 'active-icon' : ''}`}
                onClick={handleUserClick}
              />
              {authenticated && showDropdown && (
                <ul className="dropdown-menu c-menu show">
                  <Link className="dropdown-item c-drop-item" to="/Account/MyAccount"
                    onClick={() => setShowDropdown(false)}>
                    <span className="menu-text">👤 Λογαριασμός</span>
                  </Link>
                  <Link className="dropdown-item c-drop-item" to="/Account/MyFavourites" onClick={() => setShowDropdown(false)}>
                    <span className="menu-text">❤️ Αγαπημένα</span>
                  </Link>
                  <Link className="dropdown-item c-drop-item" to="/Account/MyReviews" onClick={() => setShowDropdown(false)}>
                    <span className="menu-text">⭐ Αξιολογήσεις</span>
                  </Link>
                  <Link className="dropdown-item c-drop-item" to="/Account/MyOrders" onClick={() => setShowDropdown(false)}>
                    <span className="menu-text">📦 Παραγγελίες</span>
                  </Link>
                  <Link className="dropdown-item c-drop-item" to="/Account/MySettings" onClick={() => setShowDropdown(false)}>
                    <span className="menu-text">⚙️ Ρυθμίσεις</span>
                  </Link>
                  <Link className="dropdown-item c-drop-item" onClick={handleLogout}>
                    <span className="menu-text"><IoLogOutOutline size={"1.4rem"} />Έξοδος</span>
                  </Link>
                </ul>
              )}
            </div>
            <FaHeart
              className={`Icons ${location.pathname === "/Account/MyFavourites" ? "active-icon" : ""}`}
              onClick={() => navigate("/Account/MyFavourites")}
            />
            <BsCartFill
              className={`Icons ${location.pathname === "/Cart" ? "active-icon" : ""}`}
              onClick={() => navigate("/Cart")}

            />

            {numCartItems > 0 && (
              <span className="numberofCartItems">{numCartItems}</span>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default TopNavbar;
