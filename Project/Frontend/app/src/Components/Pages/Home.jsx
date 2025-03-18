import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbars/Navbar";
import TopNavbar from "../Navbars/TopNavbar";
import Footer from "../Navbars/Footer";
import './Home.css';
import imga from './../../assets/a.jpg'
import imgb from './../../assets/b.jpg'
import imgc from './../../assets/EshopLogo.png'
import api2, { BASE_URL } from "../../endpoints/api2";
import { useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools'

export default function Home() {
    const [isSticky, setIsSticky] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const navigate = useNavigate();
    const form = useForm();
    const { register, control, handleSubmit, formState } = form;
    const { errors } = formState;

    useEffect(() => {
        const handleScroll = () => {
            const initialPageHeight = window.innerHeight;
            const twentyPercentPoint = initialPageHeight * 0.20;
            const scrollPosition = window.scrollY;

            if (scrollPosition > twentyPercentPoint) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api2.get("products/");
                setFeaturedProducts(res.data.slice(0, 4));
            } catch (err) {
                console.error("Error fetching products", err.message);
            }
        };
        fetchProducts();
    }, []);

    function onSubmit() {
        // Απλά κάνουμε navigate στο "/"
        navigate("/");
    }

    return (
        <>
            <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
                <TopNavbar />
                <Navbar />
            </div>
            <div className="home-container">
                <section className="hero-section">
                    <div className="hero-content">
                        <p className="hero-title">Καλωσήρθατε στο E-Shop μας</p>
                        <p className="hero-subtitle">Ανακαλύψτε μοναδικά προϊόντα με εξαιρετικές τιμές</p>
                        <button
                            className="btn btn-explore"
                            onClick={() =>
                                window.scrollTo({
                                    top: document.querySelector('.featured-products').offsetTop,
                                    behavior: 'smooth'
                                })
                            }
                        >
                            Ανακαλύψτε Τώρα
                        </button>
                    </div>
                </section>

                <section className="featured-products">
                    <h2>Δημοφιλή Προϊόντα</h2>
                    <div className="products-grid">
                        {featuredProducts.map((product) => (
                            <div key={product.id} className="home-product-card">
                                <div className="home-product-image">
                                    <Link to={`/product/${product.slug}`}>
                                        <img
                                            src={product.image ? `${BASE_URL}${product.image}` : imgc}
                                            alt={product.name}
                                        />
                                    </Link>
                                </div>
                                <Link to={`/product/${product.slug}`} className="text-decoration-none">
                                    <h3>{product.name}</h3>
                                    <p>€{product.price}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <Link to="/products" className='btn btn-explore'>Όλα τα Προϊόντα μας</Link>
                </section>

                <div className="photo-container photo-container-1 my-5">
                    <img src={imga} alt={imgc} className="home-imges" />
                    <div className="text-container">
                        <p>Ανανεώστε τα μαλλιά σας με το premium σαμπουάν μας, που προσφέρει βαθύ καθαρισμό και ενυδάτωση, αναδεικνύοντας φυσική λάμψη και υγιή κίνηση.</p>
                    </div>
                </div>
                <div className="photo-container photo-container-2 my-5">
                    <div className="text-container">
                        <p>Απολαύστε μια ολοκληρωμένη περιποίηση με τις καινοτόμες φόρμουλες μας, που συνδυάζουν σαμπουάν, αφρόλουτρα σώματος και άλλα προϊόντα για αναζωογονημένη επιδερμίδα και λαμπερά μαλλιά.</p>
                    </div>
                    <img src={imgb} alt={imgc} className="home-imges" />
                </div>

                <section className="newsletter-section">
                    <h2>Εγγραφείτε για Εξαιρετικές Προσφορές</h2>
                    <form className="newsletter-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="input-btn d-flex gap-3">
                            <input
                                type="email"
                                placeholder="Διεύθυνση Email"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Το email είναι υποχρεωτικό",
                                    },
                                    pattern: {  // Separate pattern validation
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Παρακαλώ εισάγεται ένα κανονικό email"
                                    }
                                })}
                            />
                            <button type="submit">Εγγραφή</button>
                        </div>
                        <p className="errors">{errors.email?.message}</p>
                    </form>
                    <DevTool control={control} />
                </section>

                <Footer />
            </div>
        </>
    );
}
