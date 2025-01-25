import './SearchBar.css';
import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
    return (
        <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
                type="search"
                placeholder="Αναζήτηση προϊόντων..."
                className="search-input"
            />
        </div>
    );
}
