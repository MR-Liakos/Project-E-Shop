<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import api2 from "../../endpoints/api2";
import FilterBar from '../Navbars/Filterbar';
import CartContainer from '../SmallComponents/CartContainer';
import './Products.css'
import { useNavigate } from 'react-router-dom';
const Products = () => {
  // Χρησιμοποιούμε allProducts για να αποθηκεύουμε όλα τα προϊόντα από το API
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
=======
// Components/Pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import TopNavbar from "../Navbars/TopNavbar";
import Navbar from "../Navbars/Navbar";
import Footer from "../Navbars/Footer";
import api from "../../endpoints/api";
import FilterBar from "../Navbars/FilterBar";
import CartContainer from "../SmallComponents/CartContainer";
import "./Products.css";

const Products = () => {
  const { category } = useParams(); // For example, "Shampoo", "Afroloutra", etc.
  const location = useLocation();
  const [products, setProducts] = useState([]);
>>>>>>> 237cefe5252941d2e94acff41d1634f54e0952a7

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // If a category exists, use the category-specific endpoint.
        const endpoint = category ? `products/category/${category}` : "products";
        const res = await api.get(endpoint);
        setProducts(res.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchProducts();
  }, [category, location.search]);

<<<<<<< HEAD
    // Φιλτράρισμα ανά κατηγορία, εφόσον έχει επιλεγεί κάποια
    if (category) {
      //updatedProducts = updatedProducts.filter(product => product.category === category);
      navigate(`/products/${category}`);
    }

    // Φιλτράρισμα ανά εύρος τιμής, εφόσον έχει δοθεί min ή max τιμή
    if (minPrice || maxPrice) {
      const parsedMinPrice = minPrice ? parseFloat(minPrice) : null;
      const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : null;

      updatedProducts = updatedProducts.filter((product) => {
        const price = product.price;
        if (parsedMinPrice !== null && price < parsedMinPrice) return false;
        if (parsedMaxPrice !== null && price > parsedMaxPrice) return false;
        return true;
      });
    }

    // Ταξινόμηση με βάση την τιμή
    if (sortBy === "low-to-high") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-to-low") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  };
=======
>>>>>>> 237cefe5252941d2e94acff41d1634f54e0952a7
  return (
    <>
      <TopNavbar />
      <Navbar />
      <div className="home-container">
        <main className="products-section">
          <FilterBar
            onFilterChange={() => {}}
            selectedCategory={category || ""}
          />
          {products.length > 0 ? (
            <CartContainer products={products} />
          ) : (
            <div className="no-products-placeholder">
              <p>Δεν υπάρχουν προϊόντα για τα συγκεκριμένα φίλτρα!</p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Products;
