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
                    <p className='fs-5 p-footer'> <Link to="/OurCompany" className='text-decoration-none text-white fs-5'>Ο Λογαριασμός μου</Link></p>
                    <p className='fs-5 p-footer'> <Link to="/OurCompany" className='text-decoration-none text-white fs-5'>Αγαπημένα</Link></p>
                    <p className='fs-5 p-footer'> <Link to="/OurCompany" className='text-decoration-none text-white fs-5'>Cοοkies</Link></p>
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
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3032.2478692248424!2d23.006650675489176!3d40.536112648365595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a8407a4acb802f%3A0x394de9bdc66d02c4!2zzpTOuc61zrjOvc6tz4IgzqDOsc69zrXPgM65z4PPhM6uzrzOuc6_IM-EzrfPgiDOlc67zrvOrM60zr_Pgg!5e0!3m2!1sel!2sgr!4v1738446630745!5m2!1sel!2sgr"
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
                <p>© 2024 Your Company Name. All rights reserved.</p>
                <p>
                    <Link to="/terms">Όροι Χρήσης</Link> |{" "}
                    <Link to="/privacy">Πολιτική Απορρήτου</Link>
                </p>
            </div>
        </footer>
    );
}   