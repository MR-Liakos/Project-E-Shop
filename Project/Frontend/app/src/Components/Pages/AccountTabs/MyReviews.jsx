import React, { useEffect, useState } from 'react';
import api from '../../../endpoints/api';
import "./MyReviews.css"


const MyReviews = () => {
    const [reviewResponse, setReviewResponse] = useState([]);
    const [user, setUser] = useState(null);
    const [userReviews, setUserReviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ανάκτηση όλων των reviews
                const reviewRes = await api.get('api/reviews/');
                setReviewResponse(reviewRes.data);

                // Ανάκτηση στοιχείων χρήστη
                const userRes = await api.get('api/user/');
                setUser(userRes.data);
            } catch (err) {
                console.error("Error fetching reviews or user data:", err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (user && reviewResponse.length > 0) {
            // Φιλτράρισμα των reviews που έχουν το ίδιο όνομα με το user.first_name
            const filteredReviews = reviewResponse.filter(review => review.user === user.first_name);
            setUserReviews(filteredReviews);
        }
    }, [user, reviewResponse]);

    return (
        <div className="tab-content1">
            <h2 className="text-decoration-underline">Αξιολογήσεις</h2>
            {userReviews.length > 0 ? (
                userReviews.map(review => (
                    <div key={review.id} className="review-item1">
                        <p>{review.text}</p>
                        <p>Βαθμολογία: {review.rating}</p>
                        <p>onoma: {review.user}</p>
                    </div>
                ))
            ) : (
                <p>Δεν υπάρχουν αξιολογήσεις.</p>
            )}
        </div>
    );
};

export default MyReviews;