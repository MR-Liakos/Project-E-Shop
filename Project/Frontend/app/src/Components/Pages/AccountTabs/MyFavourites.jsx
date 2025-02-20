import React, { useState, useEffect } from "react";
import api from '../../../endpoints/api';
import api2 from "../../../endpoints/api2";
import { BASE_URL } from '../../../endpoints/api2';
import { Link } from 'react-router-dom'
import './MyFavourites.css'
const MyFavourites = () => {
    const [favorites, setFavorites] = useState([]);  // More descriptive than 'orders'
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        Promise.all([
            api.get('api/user/'),      // Fetch user data with favorites
            api2.get('products/')     // Fetch all products
        ])
            .then(([userResponse, productsResponse]) => {
                const userData = userResponse.data;
                const productsData = productsResponse.data;
                // Map favorite product IDs to actual product objects
                const favoriteProducts = userData.favorites.map(favoriteId =>
                    productsData.find(product => product.id === favoriteId) || {
                        id: favoriteId,
                        name: 'Product not found'
                    }
                );

                setFavorites(favoriteProducts);  // Consider renaming to setFavorites
                setIsLoading(false);

                //console.log('Fetched favorites:', favoriteProducts);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setIsLoading(false);
            });
    }, []);
    if (isLoading) {
        // Return a loading spinner or placeholder while checking auth status
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="tab-content">
                <div className="favorites-content">
                    <h2 className='favorites-title text-center'>Αγαπημένα</h2>
                    <p className="favorites-subtitle">Εδώ εμφανίζονται τα πρόσφατα αγαπημένα προϊόντα σας.</p>
                    <div className="favorites-list">
                        {favorites.map((product, idx) => (

                            <div key={`${product.id || idx}`} className="product-item">

                                <Link to={`/product/${product.slug}`} className='link-card-fav'>
                                    <div className="cust-image">
                                        <img
                                            src={product.image ? `${BASE_URL}${product.image}` : EshopLogo}
                                            className="card-img-top mx-auto d-block loved-img"
                                            alt={product.name || "Unknown Product"}
                                        />
                                    </div>
                                    <div className="product-info">
                                        <p className="product-name">{product.name || "Unnamed Product"}</p>
                                        <p className="product-id">ID: {product.id || "N/A"}</p>
                                        <p className="product-price">price: {product.price || "N/A"}</p>
                                    </div>
                                </Link>

                            </div>

                        ))}
                    </div>
                    {/* Render loved items */}
                </div>
            </div>
        </>
    )
}

export default MyFavourites