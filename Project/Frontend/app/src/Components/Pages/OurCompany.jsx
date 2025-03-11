import React from 'react'
import './OurCompany.css';
import TopNavbar from '../Navbars/TopNavbar'
import Navbar from '../Navbars/Navbar'
import Footer from '../Navbars/Footer'
import { useEffect,useState } from 'react';
const OurCompany = () => {
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
            <div className="home-container">
                <div className="about-us-page">
                    <header className="about-us-header">
                        <h1>Η Εταιρεία μας</h1>
                    </header>

                    <section className="about-us-intro">
                        <p>
                            Καλώς ήρθατε στην εταιρεία μας – ένα σύγχρονο και δυναμικό σχήμα που συνδυάζει
                            την παράδοση με την καινοτομία για να προσφέρει προϊόντα και υπηρεσίες υψηλής ποιότητας.
                        </p>
                    </section>

                    <section className="about-us-history">
                        <h2>Η Ιστορία μας</h2>
                        <p>
                            Ιδρύθηκε το [έτος ίδρυσης] με το όραμα να δημιουργήσει μια επιχείρηση που θα φέρει κοντά
                            ανθρώπους και τεχνολογία, προσφέροντας λύσεις που κάνουν τη διαφορά στην καθημερινότητα.
                            Από τότε, έχουμε εξελιχθεί και επεκταθεί συνεχώς, διατηρώντας πάντα στο επίκεντρο μας την
                            ποιότητα και την αξιοπιστία.
                        </p>
                    </section>

                    <section className="about-us-vision">
                        <h2>Το Όραμά μας</h2>
                        <p>
                            Στόχος μας είναι να δημιουργήσουμε μια ολοκληρωμένη πλατφόρμα όπου οι πελάτες μας θα βρίσκουν
                            όχι μόνο προϊόντα που ανταποκρίνονται στις σύγχρονες ανάγκες, αλλά και μια ολοκληρωμένη εμπειρία
                            εξυπηρέτησης. Πιστεύουμε ότι μέσα από την καινοτομία και τη συνεχή βελτίωση, μπορούμε να συμβάλουμε
                            στην εξέλιξη της κοινωνίας και στην ποιότητα ζωής των ανθρώπων.
                        </p>
                    </section>

                    <section className="about-us-values">
                        <h2>Οι Αξίες μας</h2>
                        <ul>
                            <li>
                                <strong>Ποιότητα:</strong> Επιδιώκουμε αριστεία σε κάθε τομέα της δραστηριότητάς μας, από
                                την επιλογή πρώτων υλών μέχρι την τελική εξυπηρέτηση των πελατών μας.
                            </li>
                            <li>
                                <strong>Καινοτομία:</strong> Είμαστε πάντα έτοιμοι να αγκαλιάσουμε νέες ιδέες και τεχνολογίες για να
                                παραμείνουμε μπροστά από τις εξελίξεις της αγοράς.
                            </li>
                            <li>
                                <strong>Εμπιστοσύνη:</strong> Η αξιοπιστία και η διαφάνεια αποτελούν ακρογωνιαίους λίθους της
                                φιλοσοφίας μας, καθώς χτίζουμε μακροχρόνιες σχέσεις με τους πελάτες και τους συνεργάτες μας.
                            </li>
                            <li>
                                <strong>Σεβασμός:</strong> Στοχεύουμε στη δημιουργία ενός περιβάλλοντος όπου ο σεβασμός προς τον άνθρωπο
                                και το περιβάλλον είναι προτεραιότητα.
                            </li>
                        </ul>
                    </section>

                    <section className="about-us-offer">
                        <h2>Τι Προσφέρουμε</h2>
                        <p>
                            Η εταιρεία μας διαθέτει μια ευρεία γκάμα προϊόντων και υπηρεσιών που καλύπτουν τις ανάγκες του
                            σύγχρονου καταναλωτή. Είτε πρόκειται για καινοτόμα προϊόντα, είτε για εξειδικευμένες υπηρεσίες,
                            κάθε μας προσπάθεια αποσκοπεί στην πλήρη ικανοποίηση των απαιτήσεων σας.
                        </p>
                    </section>

                    <section className="about-us-thanks">
                        <p>
                            Σας ευχαριστούμε που μας εμπιστεύεστε και σας προσκαλούμε να εξερευνήσετε τις λύσεις που έχουμε δημιουργήσει
                            για εσάς. Μαζί, μπορούμε να χτίσουμε ένα καλύτερο μέλλον!
                        </p>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default OurCompany