import { Outlet, useLocation } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import TopNavbar from '../Navbars/TopNavbar'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'
import Sidebar from '../Navbars/Sidebar'
import './Account.css'
import { useEffect, useState } from 'react';
//TA ROUTES POY IPARXOYN 
const validSubRoutes = [
    'MyFavourites',
    'MyOrders',
    'MySettings',
    'MyAccount',
    'MyReviews'
];

const Account = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean); //ωριζεται ως διαχωριστικο το '/'

    // ελεγχει αν το παθ ΔΕΝ υπαρχει μεσα στον πινακα τοτε γινεται true το isInvalidRoute και κανει redirect στο NotFoundPage!
    const isInvalidRoute = !validSubRoutes.some(route =>
        pathSegments.includes(route)
    );

    if (isInvalidRoute) {
        return <NotFoundPage />;
    }
    const [isSticky, setIsSticky] = useState(false);

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
    return (
        <>
            <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
                <TopNavbar />
                <Navbar />
            </div>

            <div className="home-container ">
                <div className="tab-content">
                    <Sidebar />
                    <div className="account-content">
                        <Outlet /> {/*TO COMPONENT POU THA ALLAZEI KATHE FORA*/}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};
export default Account