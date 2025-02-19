  import { useNavigate } from "react-router-dom";
  import "./FilterBar.css";
  import { useState, useEffect } from 'react';
  import { IoFilter } from "react-icons/io5";
  import { BiSortAlt2 } from "react-icons/bi";

  const FilterBar = ({ onFilterChange, selectedCategory, selectedBrand }) => {
    const [category, setCategory] = useState(selectedCategory || "");
    const [brand, setBrand] = useState(selectedBrand || "");
    const [sortBy, setSortBy] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const navigate = useNavigate();
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);

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
      setShowFiltersModal(false);
      setShowSortModal(false);
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
      setShowFiltersModal(false);
    };

    useEffect(() => {
      if (showFiltersModal || showSortModal) { // Όταν το modal είναι ανοιχτό
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    
      // Καθαρισμός όταν το component απομακρύνεται
      return () => {
        document.body.style.overflow = "";
      };
    }, [showFiltersModal,showSortModal]);

    
    return (
      <div className="filter-container">
        {/* Κουμπιά ελέγχου */}
        <div className="filter-controls">
          <button
            className="filter-button"
            onClick={() => setShowFiltersModal(true)}
          >
            <IoFilter className="filter-icon" />
            Φίλτρα
          </button>

          <button
            className="filter-button"
            onClick={() => setShowSortModal(true)}
          >
            <BiSortAlt2 className="filter-icon" />
            Ταξινόμηση
          </button>
        </div>

        {/* Modal για Φίλτρα */}
        {showFiltersModal && (
          <div className="filter-modal-overlay">
            <div className="filter-modal">
              <div className="modal-header">
                <h3>Φίλτρα</h3>
                <button
                  className="close-modal"
                  onClick={() => setShowFiltersModal(false)}
                >
                  &times;
                </button>
              </div>

              <div className="modal-content">
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
                <div className="price-range">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    className="apply-button"
                    onClick={handleApplyFilters}
                  >
                    Εφαρμογή
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => resetFilter()}
                  >
                    Επαναφορά
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal για Ταξινόμηση */}
        {showSortModal && (
          <div className="filter-modal-overlay">
            <div className="filter-modal">
              <div className="modal-header">
                <h3>Ταξινόμηση</h3>
                <button
                  className="close-modal"
                  onClick={() => setShowSortModal(false)}
                >
                  &times;
                </button>
              </div>

              <div className="modal-content">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="">Προεπιλογή</option>
                  <option value="low-to-high">Τιμή: Χαμηλή → Υψηλή</option>
                  <option value="high-to-low">Τιμή: Υψηλή → Χαμηλή</option>
                </select>

                <div className="modal-actions">
                  <button
                    className="apply-button"
                    onClick={handleApplyFilters}
                  >
                    Εφαρμογή
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setShowSortModal(false)}
                  >
                    Κλείσιμο
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default FilterBar