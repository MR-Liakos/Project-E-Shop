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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // If a category exists, use the category-specific endpoint. 
        const endpoint = category ? `products/category/${category}` : "products"; //DEN KSERW AN TO CATEGORY STIN MESI 
        // PREPEI NA SVISTEI I OXI 
        const res = await api.get(endpoint);
        setProducts(res.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchProducts();
  }, [category, location.search]);

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
