import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                {/* Στήλη 1 - Λορεμ κείμενο */}
                <div className="column ">
                    <h3 className='pb-1'>Κατηγρίες Προϊόντων</h3>
                    <p className='p-footer'><Link to="/Account" className='text-decoration-none text-white fs-5'>Σαμπουάν</Link> </p>
                    <p className='p-footer'><Link to="/Afroloutra" className='text-decoration-none text-white fs-5'>Αφρόλουτρα</Link> </p>
                    <p className='p-footer'><Link to="/SapouniaXeriwn" className='text-decoration-none text-white fs-5'>Σαμπουάν Χεριών</Link> </p>
                    <p className='p-footer'><Link to="/ArwmatikaXwrou" className='text-decoration-none text-white fs-5'>Αρωματικά Χώρου</Link> </p>
                </div>

                {/* Στήλη 2 - Λορεμ κείμενο */}
                <div className="column">
                    <h3>Η Εταιρεία</h3>
                    <p className='fs-5 p-footer'> <Link to="/OurCompany" className='text-decoration-none text-white fs-5'>Η Εταιρεία μας</Link></p>
                    <p className='fs-5 p-footer'> <Link to="/Contact" className='text-decoration-none text-white fs-5'>Επικοινωνία</Link></p>
                    <p className='fs-5 p-footer'> <Link to="/Account/MyAccount" className='text-decoration-none text-white fs-5'>Ο Λογαριασμός μου</Link></p>
                    <p className='fs-5 p-footer'> <Link to="/Account/MyFavourites" className='text-decoration-none text-white fs-5'>Αγαπημένα</Link></p>
                    <p className='fs-5 p-footer'> <Link to="/Cookies" className='text-decoration-none text-white fs-5'>Cοοkies</Link></p>
                </div>

                <div className="column">
                    <h3 className='pb-1'>Στοιχεία Επικοινωνίας</h3>
                    <p className='fs-5 p-footer'><FaPhoneAlt /> Τηλ. Επ.  : +30 210 123 4567 </p>
                    <p className='fs-5 p-footer'><FaLocationDot />  Τοποθεσία : ΔΙΠΑΕ ΣΙΝΔΟΥ</p>
                    <p className='fs-5 p-footer'><IoMail /> Email :  info@example.com</p>
                </div>

                {/* Στήλη 3 - Χάρτης */}
                <div className="column map">
                    <p className="text-white fw-bold fs-3" style={{ textAlign: 'left' }}>
                        Η Έδρα μας :
                    </p>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d774853.6675240602!2d21.584351578125005!3d40.656953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a825d003b15997%3A0x17b4aae628ae3ec9!2zzpTOmc6gzpHOlSDOo86vzr3OtM6_z4U!5e0!3m2!1sel!2sgr!4v1739647851211!5m2!1sel!2sgr"
                        width="100%"
                        height="300"
                        style={{ border: "0" }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Χάρτης - Η Έδρα μας"
                    ></iframe>
                </div>
            </div>

            {/* Κάτω μέρος του footer */}
            <div className="footer-content">
                <p>© 2024 SR Company. All rights reserved.</p>
                <p>
                    <Link to="/terms">Όροι Χρήσης</Link> |{" "}
                    <Link to="/privacy">Πολιτική Απορρήτου</Link>
                </p>
            </div>
        </footer>
    );
}   