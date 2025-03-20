// TopNavbar.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../SmallComponents/SearchBar";
import "./TopNavbar.css";
import { BsCartFill } from "react-icons/bs";
import { FaHeart, FaUser } from "react-icons/fa";
import EshopLogo from "./../../assets/logoo.png";
import { IoLogOutOutline } from "react-icons/io5";
import api2 from "../../endpoints/api2";
import api from "../../endpoints/api";
import { FiSearch } from "react-icons/fi";
import { BASE_URL } from "../../endpoints/api2";
import { CartContext } from "../SmallComponents/CartContext";

const TopNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [numCartItems, setNumCartItems] = useState(0);
  const isLoggedInLocal = localStorage.getItem("loggedIn");
  const { cartQuantity } = useContext(CartContext); //neo
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await api2.post("api/logout/");
      localStorage.setItem("loggedIn", "false");
      if (response.status === 200) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Αποτυχία αποσύνδεσης", error);
    }
  };

  const checkAuthentication = useCallback(async () => {
    try {
      if (!isLoggedInLocal || isLoggedInLocal === "false") {
        setAuthenticated(false);
        return;
      }
      setAuthenticated(true);
      await api.get("api/authenticated/");
      const ordersResponse = await api.get("api/orders/");
      const unpaidOrder = ordersResponse.data.find((order) => !order.paid);
      if (unpaidOrder) {
        setNumCartItems(unpaidOrder.order_items.length);
      }
    } catch (err) {
      setAuthenticated(false);
    }
  }, [isLoggedInLocal]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const handleUserClick = () => {
    if (!authenticated) {
      navigate("/LovedAuth");
    } else {
      setShowDropdown((prev) => !prev);
    }
  };

  // Fetch products once on mount
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

  // Update filtered products whenever searchTerm or allProducts change
  useEffect(() => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    if (!trimmedSearchTerm) {
      setFilteredProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(trimmedSearchTerm) 
      );
      setFilteredProducts(filtered);
      setIsLoading(false);
    }, 800); // Μικρή καθυστέρηση για βελτίωση απόδοσης

    return () => clearTimeout(timer);
  }, [searchTerm, allProducts]);


  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const toggleSearchModal = () => {
    setShowSearchModal((prev) => !prev);
    if (!showSearchModal) {
      setSearchTerm("");
    }
  }

  // The return block is kept completely unchanged from your original version.
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
                  {isLoading ? (
                    <div className="search-result-item loading">Loading...</div>
                  ) : filteredProducts.length > 0 ? (
                    <>
                      {filteredProducts.slice(0, 5).map(product => (
                        <div
                          key={product.id}
                          className="search-result-item"
                          onClick={() => navigate(`/product/${product.slug}`)}
                        >
                          <img src={`${BASE_URL}${product.image}`} alt={product.name} />
                          <span>{product.name}</span>
                        </div>
                      ))}
                      {filteredProducts.length > 5 && (
                        <div className="ellipsis-message">...</div>
                      )}
                    </>
                  ) : (
                    <div className="search-result-item no-results">Δεν βρέθηκαν προϊόντα.</div>
                  )}
                </div>
              )}
              <button
                className="btn-search ms-2"
                type="button"
                onClick={() => {
                  navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
                  setSearchTerm(""); // Clear search bar value
                }}
              >
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
                      {isLoading ? (
                        <div className="search-result-item-mobile loading">Loading...</div>
                      ) : filteredProducts.length > 0 ? (
                        <>
                          {filteredProducts.slice(0, 5).map(product => (
                            <div
                              key={product.id}
                              className="search-result-item-mobile"
                              onClick={() => navigate(`/product/${product.slug}`)}
                            >
                              <div className="item-content-wrapper">
                                <img
                                  src={`${BASE_URL}${product.image}`}
                                  alt={product.name}
                                  className="product-image-mobile"
                                />
                                <span className="product-name-mobile">{product.name}</span>
                                <span className="product-price-mobile">{product.price}€</span>
                              </div>
                            </div>
                          ))}
                          {filteredProducts.length > 5 && (
                            <div className="ellipsis-message-mobile">...</div>
                          )}
                        </>
                      ) : (
                        <div className="search-result-item-mobile no-results">Δεν βρέθηκαν προϊόντα.</div>
                      )}
                    </div>
                  )}
                  <button
                    className="btn-search-mobile ms-2"
                    type="button"
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
                      setSearchTerm(""); // Clear search bar value
                      toggleSearchModal(); //close the modal after searching
                    }}
                  >
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
              className={'Icons ${isCartOrDetailsPage ? "active-icon" : ""}'}
              onClick={() => navigate("/Cart")}
            />
            {cartQuantity > 0 && (
              <span className="numberofCartItems">{cartQuantity}</span>
            )}

          </div>
        </div>
      </nav>
    </div>
  );
};

export default TopNavbar;
