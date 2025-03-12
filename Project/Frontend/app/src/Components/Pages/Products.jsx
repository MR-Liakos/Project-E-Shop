import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import TopNavbar from "../Navbars/TopNavbar";
import Navbar from "../Navbars/Navbar";
import Footer from "../Navbars/Footer";
import api2 from "../../endpoints/api2";
import FilterBar from "../Navbars/Filterbar";
import CartContainer from "../SmallComponents/CartContainer";
import "./Products.css";

// Helper function to filter and sort products based on URL search parameters
const filterAndSortProducts = (products, category, searchParams) => {
  let filtered = products.filter(product => {
    // Category filter
    if (category && product.category !== category) return false;

    // Brand filter
    const selectedBrand = searchParams.get('brand');
    if (selectedBrand && product.brand !== selectedBrand) return false;

    // Price filter (handles commas in decimals)
    const minPrice = parseFloat((searchParams.get('minPrice') || '').replace(/,/g, '.'));
    const maxPrice = parseFloat((searchParams.get('maxPrice') || '').replace(/,/g, '.'));
    const productPrice = parseFloat(product.price.toString().replace(/,/g, '.'));

    if (!isNaN(minPrice) && productPrice < minPrice) return false;
    if (!isNaN(maxPrice) && productPrice > maxPrice) return false;

    return true;
  });

  // New: Search term filtering
  const searchTerm = searchParams.get('search');
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description && product.description.toLowerCase().includes(lowerSearchTerm))
    );
  }

  // Sorting logic
  const sortBy = searchParams.get('sort');
  if (sortBy === 'low-to-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'high-to-low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
};

const Products = ({ numCartItems }) => {
  const { category } = useParams();
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isSticky, setIsSticky] = useState(false);

  // Fetch all products once on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api2.get("products/");
        setAllProducts(res.data);
        setSimilarProducts(getRandomProducts(res.data));
      } catch (err) {
        console.error("Error fetching products", err.message);
      }
    };
    fetchProducts();
  }, []);

  // Returns a random subset of products for suggestions
  const getRandomProducts = (products, count = 4) => {
    const safeProducts = products || [];
    return [...safeProducts].sort(() => 0.5 - Math.random()).slice(0, count);
  };

  // Memoized filtered and sorted products using the helper function
  const filteredProducts = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return filterAndSortProducts(allProducts, category, searchParams);
  }, [allProducts, category, location.search]);

  // Handle sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const initialPageHeight = window.innerHeight;
      const twentyPercentPoint = initialPageHeight * 0.20; // 20% of viewport height
      setIsSticky(window.scrollY > twentyPercentPoint);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll, { passive: true });
    };
  }, []);

  return (
    <>
      <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
        <TopNavbar />
        <Navbar numCartItems={numCartItems} />
      </div>
      <div className="home-container">
        <div className="products-section">
          <div className="section2">
            {filteredProducts.length > 0 ? (
              <>
                <div className="product-bar">
                  <div className="Label fs-4">
                    <label>Όλα τα προϊόντα: {filteredProducts.length}</label>
                  </div>
                  <FilterBar
                    selectedCategory={category || ""}
                    onFilterChange={() => { }}
                  />
                </div>
                <div className="prod-container">
                  <CartContainer products={filteredProducts} />
                </div>
              </>
            ) : (
              <div className="no-products-placeholder">
                <div className="product-bar">
                  <div className="Label fs-4">
                    <label>Όλα τα προϊόντα: {filteredProducts.length}</label>
                  </div>
                  <FilterBar
                    selectedCategory={category || ""}
                    onFilterChange={() => { }}
                  />
                </div>
                <div className="similar-products-section">
                  <p>Δεν υπάρχουν προϊόντα για τα συγκεκριμένα φίλτρα!</p>
                </div>
                <div className="Random-Products">
                  <div className="title-border">
                    <h2 className="similar-products-title text-center">Άλλα προϊόντα</h2>
                    {similarProducts.length > 0 ? (
                      <div className="prod-container">
                        <CartContainer products={similarProducts} />
                      </div>
                    ) : (
                      <p className="text-muted">Δεν βρέθηκαν παρόμοια προϊόντα.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Products;
