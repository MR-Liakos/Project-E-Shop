
import { useNavigate } from "react-router-dom";
import "./FilterBar.css";
import { useState, useEffect } from 'react';


const FilterBar = ({ onFilterChange, selectedCategory, selectedBrand }) => {
  const [category, setCategory] = useState(selectedCategory || "");
  const [brand, setBrand] = useState(selectedBrand || "");
  const [sortBy, setSortBy] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  // Update local state when props change
  useEffect(() => {
    setCategory(selectedCategory || "");
    setBrand(selectedBrand || "");
  }, [selectedCategory, selectedBrand]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    
    if (brand) params.set('brand', brand);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy) params.set('sort', sortBy);

    const basePath = category ? `/Products/${category}` : '/Products';
    navigate({
      pathname: basePath,
      search: params.toString()
    });

    onFilterChange({ category, brand, minPrice, maxPrice, sortBy });
  };

  const resetFilter = () => {
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    navigate("/Products");
    onFilterChange({ 
      category: "", 
      brand: "", 
      minPrice: "", 
      maxPrice: "", 
      sortBy: "" 
    });
  };

  return (
    <div className="filter-sidebar">
      <h3>Φίλτρα</h3>

      <label>Κατηγορία</label>
      <select value={category} onChange={handleCategoryChange}>
        <option value="">Όλες</option>
        <option value="Shampoo">Shampoo</option>
        <option value="Body Lotion">Body Lotion</option>
        <option value="Shower Gel">Shower Gel</option>
        <option value="Liquid Soap">Liquid Soap</option>
        <option value="Room Sprey">Room Sprey</option>
      </select>
      
      <label>Brand</label>
      <select value={brand} onChange={handleBrandChange}>
        <option value="">Όλες</option>
        <option value="Amouage">Amouage</option>
        <option value="Balmain">Balmain</option>
        <option value="Chopard">Chopard</option>
        <option value="Lalique">Lalique</option>
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

      <button onChange={handleApplyFilters}>Εφαρμογή</button>
      <button onClick={resetFilter}>Επαναφορά</button>
    </div>
  );
};

export default FilterBar;