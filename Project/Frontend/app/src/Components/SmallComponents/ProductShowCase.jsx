import React, { useEffect, useState } from 'react';
import './ProductShowCase.css'
import api2, { BASE_URL } from '../../endpoints/api2';
import { useParams } from 'react-router-dom';
import CartContainer from './CartContainer';

const ProductShowCase = () => {
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState({});

    const [similarProducts, setSimilarProducts] = useState([]);
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

    const getRandomProducts = (products, count = 4) => {
        return [...products].sort(() => 0.5 - Math.random()).slice(0, count);
    };

    return (
        <>
            <div className="similar-products-section pb-5">
                {similarProducts.length > 0 ? (
                    <div className="cart-container">    
                        <CartContainer products={similarProducts} />
                    </div>
                ) : (
                    <p className="text-muted">Δεν βρέθηκαν παρόμοια προϊόντα.</p>
                )}
            </div>
        </>
    )
}

export default ProductShowCase