import React, { useState } from "react";
import "./FilterBar.css";

const FilterBar = ({ onFilterChange }) => {
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // FILTER METHOD
  const handleApplyFilters = () => {
    onFilterChange({ category, minPrice, maxPrice, sortBy });
  };

  // RESET FILTERS
  const resetFilter = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    onFilterChange({ category: "", minPrice: "", maxPrice: "", sortBy: "" });
  };

  return (
    <div className="filter-sidebar">
      <h3>Φίλτρα</h3>

      <label>Κατηγορία</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Όλες</option>
        <option value="Shampoo">Σαμπουάν</option>
        <option value="Body Lotion">Body Lotion</option>
        <option value="Shower Gel">Shower Gel</option>
        <option value="Liquid Soap">Liquid Soap</option>
        <option value="Room Sprey">Room Sprey</option>
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
