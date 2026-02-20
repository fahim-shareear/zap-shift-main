import React from 'react';
import quote from "../../assets/reviewQuote.png"

const ReviewCard = ({ review }) => {
    return (
        // Removed max-w-80 and replaced with full width of the SwiperSlide container
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-full flex flex-col p-6 mx-2 w-100 mb-4">
            <div className="mb-4">
                <img src={quote} alt="quote" className="w-10 opacity-50" />
            </div>
            
            <div className="grow">
                {/* Fixed height or line-clamp helps keep cards uniform */}
                <p className="italic text-gray-700 text-lg leading-relaxed line-clamp-4">
                    "{review.review}"
                </p>
            </div>

            <div className="mt-6 pt-6 border-t border-dashed border-primary/30 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 shrink-0 flex items-center justify-center font-bold text-primary">
                    {review.userName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                    <h4 className="font-bold text-gray-900 truncate">{review.userName}</h4>
                    <p className="text-xs text-gray-500 truncate">{review.user_email}</p>
                    <div className="text-yellow-500 font-bold mt-1">
                        {"★".repeat(Math.round(review.ratings))}
                        <span className="text-gray-300 ml-1">({review.ratings})</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;