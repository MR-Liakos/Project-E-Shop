import { IoMdStarOutline } from "react-icons/io";
import { MdOutlineStarHalf } from "react-icons/md";
import { MdOutlineStarPurple500 } from "react-icons/md";
import React from "react";

const StarRating = ({ average }) => {
    const stars = [];
    const fullStars = Math.floor(average);
    const hasHalfStar = (average - fullStars) >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(
                <MdOutlineStarPurple500
                    key={i}
                    className="star-icon full-star"
                />
            );
        } else if (i === fullStars && hasHalfStar) {
            stars.push(
                <MdOutlineStarHalf
                    key={i}
                    className="star-icon half-star"
                />
            );
        } else {
            stars.push(
                <IoMdStarOutline
                    key={i}
                    className="star-icon empty-star"
                />
            );
        }
    }

    return <div className="star-rating">{stars}</div>;
};

export default StarRating;
