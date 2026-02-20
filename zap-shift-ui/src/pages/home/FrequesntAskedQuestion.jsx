import React from 'react';
import { FaArrowAltCircleRight } from 'react-icons/fa';

const FrequesntAskedQuestion = () => {
    return (
        <div className="m-5">
            <div className="max-w-4xl mx-auto text-center my-4">
                <h1 className="font-bold text-primary md:text-3xl text-xl py-2">Frrequently Asked Question (FAQ)</h1>
                <p className="font-medium opacity-80 py-2">Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!</p>
            </div>
            <div className="max-w-4xl mx-auto m-4">
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-2" defaultChecked />
                    <div className="collapse-title font-semibold text-primary">How does this posture corrector work?</div>
                    <div className="collapse-content text-sm">A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here’s how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.</div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-primary">Is it suitable for all ages and body types?</div>
                    <div className="collapse-content text-sm">Click on "Forgot Password" on the login page and follow the instructions sent to your email.</div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-primary">Does it really help with back pain and posture improvement?</div>
                    <div className="collapse-content text-sm">Go to "My Account" settings and select "Edit Profile" to make changes.</div>
                </div>
            </div>
            <div className="flex items-center justify-center gap-1">
                <button className="font-bold text-primary bg-secondary cursor-pointer trasition-all duration-150 active:scale-95 active:shadow-inner rounded-md px-5 py-4 text-xl">See More FAQ</button>
                <FaArrowAltCircleRight className="-rotate-45 text-5xl text-primary"></FaArrowAltCircleRight>
            </div>
        </div>
    );
};

export default FrequesntAskedQuestion;