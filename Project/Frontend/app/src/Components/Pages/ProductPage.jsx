import React, { useEffect, useState } from 'react'
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import { useParams } from 'react-router-dom';
import api from '../../endpoints/api'
import { BASE_URL } from '../../endpoints/api'


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
                        <div className="product-meta">
                                <p>Κωδικός προϊόντος: <span>{product.code}</span></p>
                            </div>
                        <div className="product-description">
                            <h3 className='text-start pb-1'>Περιγραφή Προϊόντος</h3>
                            <p className='desc'>{product.description}</p>
                        </div>
                        <div className="price-section fs-4 py-3 text-start">
                            <span><h3>Τιμή Προϊόντος:</h3> </span>
                            <span className="product-price">{product.price}€ (συμπ. ΦΠΑ)</span>
                        </div>
                        <div className="product-actions pt-5">
                            <button className="btn btn-add-to-cart" >
                                Προσθήκη στο καλάθι
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
export default ProductPage;