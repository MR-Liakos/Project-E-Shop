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

  useEffect(() => {
    api2.get("products/")
      .then(res => {
        // Αρχικά, εμφανίζουμε όλα τα προϊόντα
        setAllProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  }, []);

  const handleFilterChange = ({ category, minPrice, maxPrice, sortBy }) => {
    let updatedProducts = [...allProducts];

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
  return (
    <>
      <TopNavbar />
      <Navbar />
      <div className="home-container">
        <main className="products-section">
          <FilterBar onFilterChange={handleFilterChange} />
          {filteredProducts && filteredProducts.length > 0 ? (
            <CartContainer products={filteredProducts} />
          ) : (
            <div className="no-products-placeholder fs-3 text-black">
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
