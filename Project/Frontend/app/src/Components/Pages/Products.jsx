import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import TopNavbar from "../Navbars/TopNavbar";
import Navbar from "../Navbars/Navbar";
import Footer from "../Navbars/Footer";
import api2 from "../../endpoints/api2";
import FilterBar from "../Navbars/Filterbar";
import CartContainer from "../SmallComponents/CartContainer";
import "./Products.css";

const Products = () => {
  const { category } = useParams();
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all products once on component mount
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

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Filter products
    let filtered = allProducts.filter(product => {
      // Category filter
      if (category && product.category !== category) return false;
      
      // Brand filter
      const selectedBrand = searchParams.get('brand');
      if (selectedBrand && product.brand !== selectedBrand) return false;
      
      // Price filter with decimal handling
      const minPrice = parseFloat(
        (searchParams.get('minPrice') || '').replace(/,/g, '.')
      );
      const maxPrice = parseFloat(
        (searchParams.get('maxPrice') || '').replace(/,/g, '.')
      );
      
      // Convert product price to float safely
      const productPrice = parseFloat(
        product.price.toString().replace(/,/g, '.')
      );

      if (!isNaN(minPrice) && productPrice < minPrice) return false;
      if (!isNaN(maxPrice) && productPrice > maxPrice) return false;

      return true;
    });

    // Sorting logic
    const sortBy = searchParams.get('sort');
    if (sortBy === 'low-to-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-to-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [allProducts, category, location.search]);

  return (
    <>
      <TopNavbar />
      <Navbar />
      <div className="home-container">
        <main className="products-section ">
          <FilterBar
            selectedCategory={category || ""}
            onFilterChange={() => {}}
          />
          <div className="Label fs-4">
            <label>Όλα τα προϊόντα: {filteredProducts.length}</label>
          </div>
          <div className="prod-container">
            {filteredProducts.length > 0 ? (
              <CartContainer products={filteredProducts} />
            ) : (
              <div className="no-products-placeholder">
                <p>Δεν υπάρχουν προϊόντα για τα συγκεκριμένα φίλτρα!</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Products;
/*
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import TopNavbar from "../Navbars/TopNavbar";
import Navbar from "../Navbars/Navbar";
import Footer from "../Navbars/Footer";
import api2 from "../../endpoints/api2";
import FilterBar from "../Navbars/Filterbar";
import CartContainer from "../SmallComponents/CartContainer";
import "./Products.css";

const Products = () => {
  const { category } = useParams(); // For example, "Shampoo", "Afroloutra", etc.
  const location = useLocation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api2.get(`products/`);
        setProducts(res.data);
      } catch (err) {
        console.error("Eroor sto products",err.message);
      }
    };

    fetchProducts();
  }, [category, location.search]);

  return (
    <>
      <TopNavbar />
      <Navbar />
      <div className="home-container">
        <main className="products-section ">
          <FilterBar
            onFilterChange={() => { }}
            selectedCategory={category || ""}
          />
          <div className="Label fs-4">
              <label>Όλα τα προϊόντα: {products.length}</label>
          </div>
          <div className="prod-container">
            {products.length > 0 ? (
              <CartContainer products={products} />
            ) : (
              <div className="no-products-placeholder">
                <p>Δεν υπάρχουν προϊόντα για τα συγκεκριμένα φίλτρα!</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Products;*/