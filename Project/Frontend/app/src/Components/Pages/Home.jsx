import Navbar from "../Navbars/Navbar";
import TopNavbar from "../Navbars/TopNavbar";
import Footer from "../Navbars/Footer";
import './Home.css';
import Card from "../SmallComponents/Card";
import imga from './../../assets/a.jpg'
import imgb from './../../assets/b.jpg'

export default function Home() {
    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                <div className="container my-4">
                    <div className="row">
                        <div className="col-md-6 text-center">
                            <img
                                src={imga}
                                className="img-fluid  cu-img"
                                alt="..."
                                style={{ objectFit: "contain",  height: "480px" }}
                            />
                        </div>
                        <div className="col-md-6 text-center">
                            <img
                                src={imgb}
                                className="img-fluid  cu-img"
                                alt="..."
                                style={{ objectFit: "contain", height: "480px" }}
                            />
                        </div>
                    </div>
                </div>

                <p className="text-center fs-2 fw-bold mb-3">BEST SELLERS</p>
                
                <Footer />
            </div>
        </>
    );
}