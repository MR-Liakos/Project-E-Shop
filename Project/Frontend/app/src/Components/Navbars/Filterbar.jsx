import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FilterBar.css";

const FilterBar = ({ onFilterChange, selectedCategory,selectedBrand }) => {
  // Local state for filters
  const [category, setCategory] = useState(selectedCategory || "");
  const [brand, setbrand] = useState(selectedBrand || ""); // ???????????
  const [sortBy, setSortBy] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

  // Update local state when the dropdown changes; do not navigate yet.
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // When "Εφαρμογή" is clicked, update the URL and notify the parent.
  const handleApplyFilters = () => { //ALLAGI + AND/OR BRANDS?????????????? 
    if (category) {
      navigate(`/Products/${category}`);
    } else {
      navigate("/Products");
    }
    onFilterChange({ category, minPrice, maxPrice, sortBy });
  };

  // Reset all filters and navigate back to /Products.
  const resetFilter = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    onFilterChange({ category: "", minPrice: "", maxPrice: "", sortBy: "" });
    navigate("/Products");
  };

  return (
    <div className="filter-sidebar">
      <h3>Φίλτρα</h3>

      <label>Κατηγορία</label>
      <select value={category} onChange={handleCategoryChange}>
        <option value="">Όλες</option>
        <option value="Afroloutra">Αφρόλουτρα</option>
        <option value="Shampoo">Σαμπουάν</option>
        <option value="Body Lotion">Body Lotion</option>
        <option value="Shower Gel">Shower Gel</option>
        <option value="Liquid Soap">Liquid Soap</option>
        <option value="Room Sprey">Room Sprey</option>
      </select>
      
      <label>Brand</label>
      <select value={category} onChange={handleCategoryChange}> {/*Tha allakseis to category me Brand*/}
        <option value="">Όλες</option>
        <option value="Amouage">Amouage</option>
        <option value="Balmain">Balmain</option>
        <option value="Chopard">Chopard</option>
        <option value="La Lique">La Lique</option>
      </select>

      <label>Περιοχή Τιμών</label>
      <div>
        <input
          type="number"
          placeholder="Ελάχιστη τιμή"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="no-spinner"
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Μέγιστη τιμή"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="no-spinner"
        />
      </div>

      <label>Ταξινόμηση</label>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Προεπιλογή</option>
        <option value="low-to-high">Τιμή: Χαμηλή → Υψηλή</option>
        <option value="high-to-low">Τιμή: Υψηλή → Χαμηλή</option>
      </select>

        <button onClick={handleApplyFilters}>Εφαρμογή</button>
        <button onClick={resetFilter}>Επαναφορά</button>
    </div>
  );
};

export default FilterBar;
