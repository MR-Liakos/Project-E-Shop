import React, { useEffect, useState } from 'react'
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import ProductPlaceHolder from '../SmallComponents/ProductPlaceHolder';
import { useParams } from 'react-router-dom';
import api from '../../endpoints/api'
import { BASE_URL } from '../../endpoints/api'
import CartContainer from '../SmallComponents/CartContainer';


const ProductPage = () => {


    const [isLoading, setIsLoading] = useState(false);
    const { slug } = useParams()
    const [product, setProduct] = useState({})
    const [SimilalProducts, setSimilalProducts] = useState({})
    
    useEffect(function(){
        setIsLoading(true)
        
        api.get(`products_detail/${slug}`).then(res =>{console.log(res.data);
            setProduct(res.data)
            setSimilalProducts(res.data.similar_products)
            console.log("hereeeeeeeee",SimilalProducts); // emfanizv paromoi proionta DEN DOULEUEI
            
            setIsLoading(false)
        })
        .catch(err =>{
            console.log("Error sto Product card",err.message,);
            setIsLoading(false)
            
        })

    },[])
    
   /* if(isLoading){
        return <ProductPlaceHolder/> <CartContainer products={SimilalProducts} /> 
    }*/
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                
                    <img src={`${BASE_URL}${product.image}`} className="card-img-top mx-auto d-block c-img" alt="..." />
                    
                        <h5 className="Product-title">{product.name}</h5>
                        <p className="Product-text">{product.price}</p>
                        <p className='Product-description'>{product.description} </p>
                        <p className='code-description'>{product.code} </p>        
            </div>
            
            <Footer />
        </>
    )
}
export default ProductPage;