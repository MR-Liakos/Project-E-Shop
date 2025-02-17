import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import api2, { BASE_URL } from '../../endpoints/api2';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import './ProductPage.css';
import ProductShowCase from '../SmallComponents/ProductShowCase';
const ProductPage = () => {
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [similarProducts, setSimilarProducts] = useState([]);
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        const isFav = localStorage.getItem(`fav-${slug}`) === 'true';
        setIsFavorited(isFav);
    }, [slug]);

    const handleFavoriteToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorited(prev => {
            const newFavState = !prev;
            localStorage.setItem(`fav-${slug}`, newFavState);
            return newFavState;
        });
    };

    // Function to shuffle array and get 4 random products
    const getRandomProducts = (products, count = 4) => {
        return [...products].sort(() => 0.5 - Math.random()).slice(0, count);
    };

    // Fetch product details
    useEffect(() => {
        setIsLoading(true);
        api2.get(`products_detail/${slug}`)
            .then(res => {
                setProduct(res.data);
                if (res.data.similar_products) {
                    setSimilarProducts(getRandomProducts(res.data.similar_products));
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product", err.message);
                setIsLoading(false);
            });
    }, [slug]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <div className="product-wrapper">
                    {/* Product Image */}
                    <div className="product-image">
                        <img
                            src={product.image ? `${BASE_URL}${product.image}` : '/placeholder.jpg'}
                            alt={product.name || 'Προϊόν'}
                            className="product-main-image"
                        />
                        <button
                            className="favourites-icon"
                            onClick={handleFavoriteToggle}
                            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            {isFavorited ? (
                                <FaHeart size="1.8rem" className="add-fav-filled" />
                            ) : (
                                <FaRegHeart size="1.8rem" className="add-fav-outline" />
                            )}
                        </button>
                    </div>

                    {/* Product Details */}
                    <div className="product-details">
                        <h1 className="product-title">{product.name || 'Μη διαθέσιμο όνομα'}</h1>
                        <span className="feature-label">Κωδικός προϊόντος: {product.code || 'N/A'}</span>

                        {/* Features List */}
                        <div className="product-features mb-4">
                            <h3 className="features-heading mb-3 text-center">Βασικά Χαρακτηριστικά</h3>
                            <ul className="features-list">
                                <li className="feature-item">
                                    <span className="feature-label">Κατηγορία:</span>
                                    <span className="feature-value">{product.category || 'N/A'}</span>
                                </li>
                                <li className="feature-item">
                                    <span className="feature-label">Διαθεσιμότητα:</span>
                                    <span className="feature-value">{product.stock || 'Άγνωστο'}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Price Section */}
                        <div className="price-section fs-4 py-4">
                            <div className="product-price">
                                <h3 className="price-heading">Τιμή Προϊόντος:</h3>
                                {product.price ? `${product.price}€` : 'Μη διαθέσιμη τιμή'} <span className="vat">(συμπ. ΦΠΑ)</span>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="product-actions pt-5">
                            <button className="btn btn-add-to-cart">
                                Προσθήκη στο καλάθι
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="container-fluid px-0">
                    <div className="full-width-tabs">
                        <ul className="nav nav-tabs justify-content-center" id="productTabs" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link active"
                                    id="description-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#description"
                                    type="button"
                                    role="tab"
                                    aria-controls="description"
                                    aria-selected="true"
                                >
                                    Περιγραφή
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="reviews-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#reviews"
                                    type="button"
                                    role="tab"
                                    aria-controls="reviews"
                                    aria-selected="false"
                                >
                                    Κριτικές
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="tab-content-container">
                        <div className="tab-content mt-0">
                            <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
                                <div className="product-full-description px-4">
                                    <p className='px-5 py-4'>{product.description || 'Δεν υπάρχει περιγραφή.'}</p>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                                <p className="text-muted">Δεν υπάρχουν ακόμα κριτικές για αυτό το προϊόν</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products Section (Showing 4 Random Items) */}
                <div className='Similar-Products'>
                    <div className="title-border">
                        <h2 className="similar-products-title text-center">Παρόμοια προϊόντα</h2>
                    </div>                    
                    <ProductShowCase/>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default ProductPage;
