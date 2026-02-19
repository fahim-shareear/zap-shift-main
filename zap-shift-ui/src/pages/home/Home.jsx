import React from 'react';
import Banner from './Banner';
import HowItWorks from './HowItWorks';
import OurServices from './OurServices';
import Swipper from './Swipper';
import Desclaimer from './Desclaimer';
import CustomerBanner from './CustomerBanner';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <HowItWorks></HowItWorks>
            <OurServices></OurServices>
            <Swipper></Swipper>
            <Desclaimer></Desclaimer>
            <CustomerBanner></CustomerBanner>
        </div>
    );
};

export default Home;