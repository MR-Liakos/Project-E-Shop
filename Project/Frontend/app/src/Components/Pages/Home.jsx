import Navbar from "../Navbars/Navbar";
import TopNavbar from "../Navbars/TopNavbar";
import Footer from "../Navbars/Footer";
import './Home.css';

export default function Home() {
    return (
        <>
            <div className="home-container">
                <TopNavbar />
                <Navbar />
                <Footer />
            </div>
        </>
    );
}