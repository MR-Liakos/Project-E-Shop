import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api2 from '../../endpoints/api2';
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import './ForgotPassword.css';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await api2.post('api/password-reset/', { email });
            setIsSubmitted(true);
        } catch (err) {
            setError('Προέκυψε κάποιο σφάλμα. Παρακαλώ δοκιμάστε ξανά.');
            console.error('Error requesting password reset:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <>
                <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
                    <TopNavbar />
                    <Navbar />
                </div>
                <div className="home-container">
                    <div className="ForgotPassword-container">
                        <p className='ForgotPassword-title'>Έλεγχος Email</p>
                        <p className='ForgotPassword-text text-center'>
                            Εάν υπάρχει λογαριασμός με το email {email}, θα λάβετε έναν σύνδεσμο
                            για την επαναφορά του κωδικού πρόσβασής σας.
                        </p>
                        <p className='ForgotPassword-text text-center'>Παρακαλώ ελέγξτε το email σας και ακολουθήστε τις οδηγίες.</p>
                        <div className="form-footer">
                            <button className='forgotpass-resend' onClick={handleSubmit}>
                                Επανάληψη
                            </button>
                        </div>
                    </div>
                    <Footer />

                </div>
            </>
        );
    }

    return (
        <>
            <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
                <TopNavbar />
                <Navbar />
            </div>
            <div className="home-container">
                <div className="ForgotPassword-container">

                    <p className='ForgotPassword-title'>Ξεχάσατε τον κωδικό σας;</p>

                    {!error && <p className='ForgotPassword-text text-center px-2'>
                        Εισάγετε το email σας και θα σας στείλουμε έναν σύνδεσμο για την επαναφορά του κωδικού πρόσβασής σας.
                    </p>}

                    {error && <div className="error-message text-center">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group d-flex align-items-center mb-3">
                            <label htmlFor="email" className='forgopass-label'>Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='form-control forgotpass-input'
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="forgotpass-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Αποστολή...' : 'Αποστολή συνδέσμου επαναφοράς'}
                        </button>
                    </form>


                </div>
                <Footer />
            </div>
        </>
    );
};

export default ForgotPassword;