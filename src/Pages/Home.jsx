import React from 'react';
import Header from '../Components/Header';
import WhyChooseUs from '../Components/WhyChooseUs';
import FindVetsNearYou from '../Components/FindVetsNearYou';
import OurServices from '../Components/OurServices';
import WhoAreWe from '../Components/WhoAreWe';

const Home = () => {
  return (
    <div>
      <Header />
      <FindVetsNearYou />
      <WhyChooseUs />
      <OurServices />
      <WhoAreWe />
    </div>
  );
};

export default Home;
