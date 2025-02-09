import React, { useEffect, useState } from 'react';
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import api2 from "../../endpoints/api2";
import FilterBar from '../Navbars/Filterbar';
import CartContainer from '../SmallComponents/CartContainer';

const Afroloutra = () => {
  const [afross, setAfros] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    api2.get("products/")
      .then(res => {
        // Initially filter products (for example, only Shower Gel)
        const initialProducts = res.data.filter(product => product.category === "Shower Gel");
        setAfros(initialProducts);
        setFilteredProducts(initialProducts);
      })
      .catch(err => { console.log(err.message); });
  }, []);

  const handleFilterChange = ({ category, minPrice, maxPrice, sortBy }) => {
    let updatedProducts = [...afross];

    // Filter by category if a category is selected (non-empty means a specific category)
    if (category) {
      updatedProducts = updatedProducts.filter(product => product.category === category);
    }

    // Filter by price range if either min or max is provided
    if (minPrice || maxPrice) {
      // Convert the input strings to numbers (if provided)
      const parsedMinPrice = minPrice ? parseFloat(minPrice) : null;
      const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : null;

      updatedProducts = updatedProducts.filter((product) => {
        const price = product.price;
        if (parsedMinPrice !== null && price < parsedMinPrice) return false;
        if (parsedMaxPrice !== null && price > parsedMaxPrice) return false;
        return true;
      });
    }

    // Sorting by price if a sort order is specified
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
        <FilterBar onFilterChange={handleFilterChange} />
        <CartContainer products={filteredProducts} />
        <Footer />
      </div>
    </>
  );
};

export default Afroloutra;
