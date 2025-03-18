import React, { useState, useEffect } from "react";
import api from '../../../endpoints/api';
import api2 from "../../../endpoints/api2";
import { BASE_URL } from '../../../endpoints/api2';
import { Link } from 'react-router-dom'
import './MyFavourites.css'
import { FaRegHeart, FaHeart } from "react-icons/fa";

const MyFavourites = () => {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState([]); // Renamed to be more descriptive
    const isLoggedInLocal = localStorage.getItem("loggedIn")

    useEffect(() => {
        setIsLoading(true);

        Promise.all([
            api.get('api/user/'),
            api2.get('products/')
        ])
            .then(([userResponse, productsResponse]) => {
                const userData = userResponse.data;
                const productsData = productsResponse.data;
                
                const favoriteProducts = userData.favorites.map(favoriteId =>
                    productsData.find(product => product.id === favoriteId) || {
                        id: favoriteId,
                        name: 'Product not found'
                    }
                );

                setFavorites(favoriteProducts);
                setFavoriteIds(userData.favorites); // Initialize with actual favorite IDs
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setIsLoading(false);
            });
    }, []);

    const handleFavoriteToggle = async (productId, e) => {
        if (isLoggedInLocal) {
            e.preventDefault();
            e.stopPropagation();
            if (!productId) return;

            const previousFavorites = [...favoriteIds];
            const isCurrentlyFavorited = previousFavorites.includes(productId);

            // Optimistic update
            const newFavorites = isCurrentlyFavorited
                ? previousFavorites.filter(id => id !== productId)
                : [...previousFavorites, productId];
            setFavoriteIds(newFavorites);

            try {
                // Update backend
                await api.put('/api/favorite/', {
                    favorites: newFavorites
                });

                // Update products list after successful API call
                setFavorites(prev => prev.filter(product => product.id !== productId));
            } catch (err) {
                // Rollback on error
                setFavoriteIds(previousFavorites);
                console.error("Favorite update failed:", err);
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="-account-content">
            <div className="favorites-content">
                <h2 className='favorites-title text-center'>Τα Αγαπημένα μου</h2>
                <p className="favorites-subtitle">Εδώ εμφανίζονται τα πρόσφατα αγαπημένα προϊόντα σας.</p>
                <div className="favorites-list">
                    {favorites.map((product) => (
                        <div key={product.id} className="product-item">
                            <Link to={`/product/${product.slug}`} className='link-card-fav'>
                                <button
                                    className="favourite-icon"
                                    onClick={(e) => handleFavoriteToggle(product.id, e)}
                                    aria-label={favoriteIds.includes(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    {favoriteIds.includes(product.id) ? (
                                        <FaHeart  className="filled-icon" />
                                    ) : (
                                        <FaRegHeart  className="outline-icon" />
                                    )}
                                </button>
                                <div className="cust-image">
                                    <img
                                        src={product.image ? `${BASE_URL}${product.image}` : EshopLogo}
                                        className="card-img-top mx-auto d-block loved-img"
                                        alt={product.name || "Unknown Product"}
                                    />
                                </div>
                                <div className="product-info">
                                    <p className="product-name">{product.name || "Unnamed Product"}</p>
                                    <p className="product-price">Τιμή: {product.price || "N/A"}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyFavourites;