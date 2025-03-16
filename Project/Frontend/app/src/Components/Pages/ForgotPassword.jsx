import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api2 from '../../endpoints/api2';
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await api2.post('/api/password-reset/', { email });
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
            <div className="auth-container">
                <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
                    <TopNavbar />
                    <Navbar />
                </div>
                <div className="auth-card">
                    <h2>Έλεγχος Email</h2>
                    <p>
                        Εάν υπάρχει λογαριασμός με το email {email}, θα λάβετε έναν σύνδεσμο
                        για την επαναφορά του κωδικού πρόσβασής σας.
                    </p>
                    <p>Παρακαλώ ελέγξτε το email σας και ακολουθήστε τις οδηγίες.</p>
                    <div className="form-footer">
                        <Link to="/login" className="auth-link">
                            Επιστροφή στη σελίδα σύνδεσης
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
                <TopNavbar />
                <Navbar />
            </div>
            <div className="auth-card">
                <h2>Ξεχάσατε τον κωδικό σας;</h2>
                <p>
                    Εισάγετε το email σας και θα σας στείλουμε έναν σύνδεσμο για την επαναφορά του κωδικού πρόσβασής σας.
                </p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Αποστολή...' : 'Αποστολή συνδέσμου επαναφοράς'}
                    </button>
                </form>

                <div className="form-footer">
                    <Link to="/login" className="auth-link">
                        Επιστροφή στη σελίδα σύνδεσης
                    </Link>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default ForgotPassword;