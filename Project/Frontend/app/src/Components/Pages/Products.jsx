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
  const [similarProducts, setSimilarProducts] = useState([]);

  // Fetch all products once on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api2.get("products/");
        setSimilarProducts(getRandomProducts(res.data));
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

  const getRandomProducts = (products, count = 4) => {
    const safeProducts = products || [];
    return [...safeProducts].sort(() => 0.5 - Math.random()).slice(0, count);
  };

  return (
    <>
      <TopNavbar />
      <Navbar />
      <div className="home-container">
        <div className="products-section ">
          <div className="section2">
            {filteredProducts.length > 0 ? (<>
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

                <div className='Random-Products'>
                  <div className="title-border">
                    <h2 className="similar-products-title text-center">Άλλα προϊόντα</h2>
                    {similarProducts.length > 0 ? (
                      <div className="prod-container">
                        <CartContainer products={similarProducts} />
                      </div>

                    ) : (
                      <p className="text-muted">Δεν βρέθηκαν παρόμοια προϊόντα.</p>//??????
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