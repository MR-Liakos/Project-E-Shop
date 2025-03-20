import React, { useEffect, useState } from 'react';
import api from '../../../endpoints/api';
import "./MyReviews.css"
import StarRating from '../../SmallComponents/StarRating';

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
            const filteredReviews = reviewResponse.filter(review => review.userId === user.id);
            setUserReviews(filteredReviews);
        }
    }, [user, reviewResponse]);

    return (
        <div className="tab-account-content">
            <div className="reviews-content">
                <h3 className='reviews-title'>Οι Αξιολογήσεις μου</h3>
                <p className='reviews-subtitle'>Εδώ εμφανίζονται οι αξιολογήσεις σας.</p>
                <div className='review-items'>
                    {userReviews.length > 0 && (
                        userReviews.map(review => (
                            <div key={review.id} className="review-item">
                                <div className="user-icon-rating">
                                    <div className='top-left-review'>
                                        <div className='user-icon-name'>
                                            <span className="user-icon">👤</span>
                                            <p className='rev-user'>{review.user}</p>
                                        </div>
                                        <span className='myreview-date'>
                                            {new Date(review.created_at).toLocaleDateString('el-GR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <span className="rating-stars"><StarRating average={review.rating} /></span>
                                </div>
                                <p className='review-text'>{review.text}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyReviews;   