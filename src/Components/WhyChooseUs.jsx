import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

const WhyChooseUs = () => {
  const features = [
    {
      title: "Trusted Veterinarians",
      desc: "Work with 100+ verified and experienced vets across the country.",
      icon: assets.trusted_vet_icon,
    },
    {
      title: "Easy Booking",
      desc: "Book your appointment in just a few clicks, anytime, anywhere.",
      icon: assets.easy_booking_icon,
    },
    {
      title: "Pet-first Approach",
      desc: "We ensure your pets get the best care tailored to their needs.",
      icon: assets.pet_first_icon,
    },
    {
      title: "Secure Platform",
      desc: "Your personal information and booking details are safe with us.",
      icon: assets.secure_icon,
    },
  ];

  return (
    <div
      className="w-full py-16 px-6 md:px-12 rounded-lg lg:px-20 text-white"
      style={{
        backgroundImage: `url(${assets.hero_bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Heading */}
      <div className="text-center mb-12 drop-shadow-lg">
        <h1 className="text-3xl md:text-5xl font-bold">
          Why Choose Us?
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Because your pet deserves the best care — delivered with love and expertise.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 text-center hover:scale-105 transition-all shadow-lg"
          >
            <img
              src={feature.icon}
              alt={feature.title}
              className="w-16 h-16 mx-auto mb-4 rounded-lg"
            />
            <h2 className="text-xl font-semibold text-gray-800">{feature.title}</h2>
            <p className="mt-2 text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
