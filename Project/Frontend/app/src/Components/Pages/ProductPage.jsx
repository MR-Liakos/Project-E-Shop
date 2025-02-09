import React, { useEffect, useState } from 'react'
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import { useParams } from 'react-router-dom';
import api from '../../endpoints/api'
import { BASE_URL } from '../../endpoints/api'
import { FaRegHeart, FaHeart } from "react-icons/fa";
import './ProductPage.css'
const ProductPage = () => {

    const [isLoading, setIsLoading] = useState(false); // ??????
    const { slug } = useParams()
    const [product, setProduct] = useState({})
    const [SimilalProducts, setSimilalProducts] = useState({})
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const [isFavorited, setIsFavorited] = useState(false)
    const handleFavoriteToggle = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsFavorited(!isFavorited)
    }
    useEffect(function () {
        setIsLoading(true)

        api.get(`products_detail/${slug}`).then(res => {
            console.log(res.data);
            setProduct(res.data)
            setSimilalProducts(res.data.similar_products)
            console.log("hereeeeeeeee", SimilalProducts); // emfanizv paromoi proionta DEN DOULEUEI ??????

            setIsLoading(false)
        })
            .catch(err => {
                console.log("Error sto Product card", err.message,);
                setIsLoading(false)

            })

    }, [])

    /* if(isLoading){
         return <ProductPlaceHolder/> <CartContainer products={SimilalProducts} /> 
     }*/
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <div className="product-wrapper">
                    {/* Left: Product Image */}
                    <div className="product-image">
                        <img
                            src={`${BASE_URL}${product.image}`}
                            alt={product.name}
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

                    <div className="product-details">
                        <h1 className="product-title">{product.name}</h1>
                        <span className="feature-label">Κωδικός προϊόντος: {product.code}</span>
                        {/* Product Features List */}
                        <div className="product-features mb-4">
                            <h3 className="features-heading mb-3 text-center">Βασικά Χαρακτηριστικά</h3>
                            <ul className="features-list">
                                <li className="feature-item">
                                    <span className="feature-label">Κατηγορία:</span>
                                    <span className="feature-value">{product.category}</span>
                                </li>
                                <li className="feature-item">
                                    <span className="feature-label">Διαθεσιμότητα:</span>
                                    <span className="feature-value">{product.stock}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Price Section */}
                        <div className="price-section fs-4 py-4">
                            <div className="product-price">
                                <h3 className="price-heading">Τιμή Προϊόντος:</h3>
                                {product.price}€ <span className="vat">(συμπ. ΦΠΑ)</span>
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

                <div className="container-fluid px-0">
                    {/* Full-width Tab Bar */}
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
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link disabled"
                                    id="disabled-tab"
                                    type="button"
                                    role="tab"
                                    aria-selected="false"
                                    disabled
                                >
                                    Προσεχώς
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Full-width Tab Content */}
                    <div className="tab-content-container">
                        <div className="tab-content mt-0">
                            {/* Description Tab */}
                            <div
                                className="tab-pane fade show active"
                                id="description"
                                role="tabpanel"
                                aria-labelledby="description-tab"
                            >
                                <div className="product-full-description px4">
                                    <p className='px-5 py-4'>
                                        {product.description}
                                    </p>
                                </div>
                            </div>



                            {/* Reviews Tab */}
                            <div
                                className="tab-pane fade"
                                id="reviews"
                                role="tabpanel"
                                aria-labelledby="reviews-tab"
                            >
                                <p className="text-muted">
                                    Δεν υπάρχουν ακόμα κριτικές για αυτό το προϊόν
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
export default ProductPage;