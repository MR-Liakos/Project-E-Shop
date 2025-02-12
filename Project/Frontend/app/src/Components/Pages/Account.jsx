import { Outlet, useLocation } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import TopNavbar from '../Navbars/TopNavbar'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'
import Sidebar from '../Navbars/Sidebar'
import './Account.css'

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

    return (
        <>
            <TopNavbar />
            <Navbar />
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