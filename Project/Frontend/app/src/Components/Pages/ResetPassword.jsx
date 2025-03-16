import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api2 from '../../endpoints/api2';
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import './ResetPassword.css'

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isValidToken, setIsValidToken] = useState(true);
    const [isSticky, setIsSticky] = useState(false);
    const { uid, token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Μπορείτε να προσθέσετε έναν προκαταρκτικό έλεγχο του token αν θέλετε
        if (!uid || !token) {
            setIsValidToken(false);
        }
    }, [uid, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Έλεγχος αν οι κωδικοί ταιριάζουν
        if (password !== confirmPassword) {
            setError('Οι κωδικοί δεν ταιριάζουν');
            return;
        }

        // Έλεγχος για την πολυπλοκότητα του κωδικού
        if (password.length < 8) {
            setError('Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await api2.post('/api/password-reset-confirm/', {
                uid,
                token,
                new_password: password
            });

            setIsSuccess(true);

            // Ανακατεύθυνση στη σελίδα σύνδεσης μετά από 3 δευτερόλεπτα
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err) {
            console.error('Error resetting password:', err);

            if (err.response && err.response.data.error) {
                if (err.response.status === 400 &&
                    (err.response.data.error === 'Invalid or expired token' ||
                        err.response.data.error === 'Invalid reset link')) {
                    setIsValidToken(false);
                } else {
                    setError(err.response.data.error);
                }
            } else {
                setError('Προέκυψε κάποιο σφάλμα. Παρακαλώ δοκιμάστε ξανά.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    // Handle sticky navbar on scroll
    useEffect(() => {
        const handleScroll = () => {
            const initialPageHeight = window.innerHeight;
            const twentyPercentPoint = initialPageHeight * 0.20; // 20% of viewport height
            setIsSticky(window.scrollY > twentyPercentPoint);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll, { passive: true });
        };
    }, []);

    if (!isValidToken) {
        return (
            <>
                <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
                    <TopNavbar />
                    <Navbar />
                </div>
                <div className="home-container">
                    <div className='reset-password-container'>
                        <h2 className='text-center'>Μη έγκυρος σύνδεσμος</h2>
                        <p className='text-center'>
                            Ο σύνδεσμος επαναφοράς κωδικού είναι μη έγκυρος ή έχει λήξει.
                        </p>
                        <p className='text-center'>Παρακαλώ ζητήστε έναν νέο σύνδεσμο επαναφοράς κωδικού.</p>
                        <div className="form-footer">
                            <Link to="/forgot-password" className="forgotpass-resend text-decoration-none">
                                Αίτηση νέου συνδέσμου
                            </Link>
                        </div>
                    </div>

                    <Footer />
                </div>
            </>
        );
    }

    if (isSuccess) {
        return (
            <>
                <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
                    <TopNavbar />
                    <Navbar />
                </div>
                <div className="home-container">
                    <div className='reset-password-container'>
                        <h2>Επιτυχής επαναφορά κωδικού!</h2>
                        <p>
                            Ο κωδικός σας έχει ενημερωθεί επιτυχώς. Θα ανακατευθυνθείτε στη
                            σελίδα σύνδεσης σε λίγα δευτερόλεπτα...
                        </p>
                        <div className="form-footer">
                            <Link to="/login" className="auth-link">
                                Σύνδεση τώρα
                            </Link>
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
                <div className='reset-password-container'>
                    <h2>Επαναφορά κωδικού πρόσβασης</h2>
                    <p>Παρακαλώ εισάγετε τον νέο κωδικό πρόσβασής σας.</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className='reset-password-form'>
                        <div className='reset-groups'>
                            <div className="form-group reset-group">
                                <label htmlFor="password">Νέος κωδικός</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className='reset-password'
                                />
                            </div>

                            <div className="form-group reset-group">
                                <label htmlFor="confirmPassword">Επιβεβαίωση κωδικού</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className='reset-confirm'
                                />
                            </div>
                        </div>

                        <div className='reset-btn-container'>
                            <button
                                type="submit"
                                className="btn-reset-pass"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Αποθήκευση...' : 'Αποθήκευση νέου κωδικού'}
                            </button>
                        </div>
                    </form>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default ResetPassword;