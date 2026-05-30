import React from 'react';
import Banner from './Banner';
import HowItWorks from './HowItWorks';
import OurServices from './OurServices';
import Swipper from './Swipper';
import Desclaimer from './Desclaimer';
import CustomerBanner from './CustomerBanner';
import Feedback from './Feedback';
import FrequesntAskedQuestion from './FrequesntAskedQuestion';

const feedbackPromise = fetch('https://zap-shift-server-sand.vercel.app/feedback').then(res => res.json());

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <HowItWorks></HowItWorks>
            <OurServices></OurServices>
            <Swipper></Swipper>
            <Desclaimer></Desclaimer>
            <CustomerBanner></CustomerBanner>
            <Feedback feedbackPromise={feedbackPromise}></Feedback>
            <FrequesntAskedQuestion></FrequesntAskedQuestion>
        </div>
    );
};

export default Home;