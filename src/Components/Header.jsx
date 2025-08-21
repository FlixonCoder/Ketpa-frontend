import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

const HeroSection = () => {
  return (
    <div
      className="relative w-full h-[85vh] flex flex-col rounded-lg justify-center items-center text-white text-center"
      style={{
        backgroundImage: `url(${assets.hero_bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg px-4">
        Now and forever for your pets!
      </h1>
    </div>
  );
};

export default HeroSection;
