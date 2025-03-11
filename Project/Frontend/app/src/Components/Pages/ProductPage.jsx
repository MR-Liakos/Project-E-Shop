import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import api2, { BASE_URL } from '../../endpoints/api2';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CartContainer from '../SmallComponents/CartContainer';
import './ProductPage.css';
import api from '../../endpoints/api';

const ProductPage = () => {
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [similarProducts, setSimilarProducts] = useState([]);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isFavLoading, setIsFavLoading] = useState(false);
    const isLoggedInLocal = localStorage.getItem("loggedIn") === "true";
    const [quantity, setQuantity] = useState(1);
    const [showQuantitySelector, setShowQuantitySelector] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    // Get initial favorite status from API
    useEffect(() => {
        const checkInitialFavorite = async () => {
            if (isLoggedInLocal) {
                try {
                    const response = await api.get('api/user/');
                    setIsFavorited(response.data.favorites.includes(product.id));
                } catch (err) {
                    console.error("Error checking favorites:", err);
                }
            }
        };

        if (product.id) {
            checkInitialFavorite();
        }
    }, [product.id]);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedInLocal) {
            alert("Πρέπει να συνδεθείτε για να προσθέσετε προϊόντα στο καλάθι.");
            return;
        }

        if (!showQuantitySelector) {
            setShowQuantitySelector(true);
            return;
        }

        try {
            // 1. Ανάκτηση όλων των παραγγελιών που δεν έχουν πληρωθεί
            const existingOrderResponse = await api.get("/api/orders/", {
                params: { paid: false }
            });

            // Φιλτράρουμε μόνο τις unpaid παραγγελίες
            const unpaidOrders = existingOrderResponse.data.filter(order => order.paid === false);

            let existingOrder = null;

            if (unpaidOrders.length > 1) {
                // Αν υπάρχουν περισσότερες από μία, ταξινομούμε τον πίνακα με βάση το id (υποθέτουμε ότι το μικρότερο id είναι η παλαιότερη παραγγελία)
                unpaidOrders.sort((a, b) => a.id - b.id);
                // Κρατάμε την πιο πρόσφατη παραγγελία (δηλαδή, το τελευταίο στοιχείο μετά το sort)
                const orderToKeep = unpaidOrders[unpaidOrders.length - 1];

                // Διαγράφουμε όλες τις παραγγελίες εκτός από την πιο πρόσφατη
                for (let i = 0; i < unpaidOrders.length - 1; i++) {
                    const orderToDelete = unpaidOrders[i];
                    await api.delete(`/api/orders/${orderToDelete.id}/`);
                    console.log(`Deleted old order with id: ${orderToDelete.id}`);
                }

                existingOrder = orderToKeep;
            } else if (unpaidOrders.length === 1) {
                existingOrder = unpaidOrders[0];
            } else {
                existingOrder = null;
            }

            // 2. Προετοιμασία δεδομένων για το αίτημα
            const requestData = {
                order_items: [{
                    product: product.id,
                    quantity: quantity
                }]
            };

            let response;

            // Αν υπάρχει unpaid παραγγελία, κάνουμε ενημέρωση (PATCH), αλλιώς δημιουργούμε νέα παραγγελία (POST)
            if (existingOrder && existingOrder.paid === false) {
                console.log('Updating existing order:', existingOrder.id);
                response = await api.patch(
                    `/api/orders/${existingOrder.id}/`,
                    requestData
                );

            } else {
                console.log('Creating new order');
                response = await api.post("/api/orders/", requestData);
            }
            navigate('/Products');
            setShowQuantitySelector(false);

        } catch (err) {
            console.error("Error adding to cart:", err);
            alert("Αποτυχία προσθήκης στο καλάθι. Έχετε ήδη αυτό το προϊόν στο καλάθι;");
        }
    };

    const handleFavoriteToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLoggedInLocal) {
            if (!product?.id || isFavLoading) return;

            setIsFavLoading(true);
            const previousState = isFavorited;

            try {
                // Optimistic UI update
                setIsFavorited(!previousState);

                // Update favorites on backend
                const response = await api.put('/api/favorite/', {
                    favorites: previousState
                        ? (await api.get('api/user/')).data.favorites.filter(id => id !== product.id)
                        : [...(await api.get('api/user/')).data.favorites, product.id]
                });

                // Final update from server response
                setIsFavorited(response.data.favorites.includes(product.id));
            } catch (err) {
                // Rollback on error
                setIsFavorited(previousState);
                console.error("Favorite update failed:", err);
            } finally {
                setIsFavLoading(false);
            }
        }
    };

    // Get random products safely
    const getRandomProducts = (products, count = 4) => {
        const safeProducts = products || [];
        return [...safeProducts].sort(() => 0.5 - Math.random()).slice(0, count);
    };

    useEffect(() => {
        const handleScroll = () => {
            // Calculate the halfway point of the initial visible page height
            const initialPageHeight = window.innerHeight;

            const twentyPercentPoint = initialPageHeight * 0.20; // 20%

            // Get the current scroll position
            const scrollPosition = window.scrollY;

            // Check if the scroll position is past the halfway point
            if (scrollPosition > twentyPercentPoint) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        // Add the scroll event listener
        window.addEventListener("scroll", handleScroll);

        // Remove the listener when the component unmounts
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    // Fetch product details
    useEffect(() => {
        if (!slug) return; // Prevent call with undefined slug

        setIsLoading(true);
        api2.get(`products_detail/${slug}`)
            .then(res => {
                setProduct(res.data);
                setSimilarProducts(getRandomProducts(res.data.similar_products));
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product", err);
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
            <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
                <TopNavbar />
                <Navbar />
            </div>
            <div className="home-container">
                <div className="product-wrapper">
                    <div className="product-image">
                        <img
                            src={product.image ? `${BASE_URL}${product.image}` : '/placeholder.jpg'}
                            alt={product.name || 'Προϊόν'}
                            className="product-main-image"
                        />
                        <button
                            className="favourites-icon"
                            onClick={handleFavoriteToggle}
                            disabled={isFavLoading}
                            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            {isFavLoading ? (
                                <div className="spinner-border text-danger" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : isFavorited ? (
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
                            {!showQuantitySelector ? (
                                <button
                                    onClick={handleAddToCart}
                                    className="btn btn-add-to-cart"
                                >
                                    Προσθήκη στο καλάθι
                                </button>
                            ) : (
                                <button className="btn btn-add-to-cart flex items-center justify-between">
                                    <span
                                        className="quantity-decrease px-3"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setQuantity(quantity > 1 ? quantity - 1 : 1);
                                            // Δεν καλούμε το handleAddToCart εδώ αφού θα αλλάξει μόνο την ποσότητα
                                        }}
                                    >
                                        -
                                    </span>
                                    <span className="quantity-value px-3">{quantity}</span>
                                    <span
                                        className="quantity-increase px-3"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setQuantity(quantity + 1);
                                            // Δεν καλούμε το handleAddToCart εδώ αφού θα αλλάξει μόνο την ποσότητα
                                        }}
                                    >
                                        +
                                    </span>
                                    <span
                                        className="confirm-btn px-3 ml-2"
                                        onClick={handleAddToCart}
                                    >
                                        ✓
                                    </span>
                                </button>
                            )}

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
                <div className="similar-products-section">
                    <h2 className="section-title">Παρόμοια προϊόντα</h2>
                    {similarProducts.length > 0 ? (
                        <CartContainer products={similarProducts} />
                    ) : (
                        <p className="text-muted">Δεν βρέθηκαν παρόμοια προϊόντα.</p>
                    )}
                </div>

                <Footer />
            </div>
        </>
    );
};

export default ProductPage;