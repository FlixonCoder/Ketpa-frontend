import React from 'react';
import { FaSearchLocation, FaPaw } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FindVetsSection = () => {

  const navigate = useNavigate()

  return (
    <div className="w-full h-[300px] py-16 px-6 md:px-12 lg:px-20 bg-white text-center rounded-lg">
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 z-50">
        Find vets near you!
      </h1>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={()=>{navigate('/find-vets', scrollTo(0,0))}} className="flex items-center gap-2 bg-primary hover:bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
          <FaSearchLocation size={18} />
          <span>Jayanagar, Koramangla etc</span>
        </button>

        <button onClick={()=>{navigate('/find-vets', scrollTo(0,0))}} className="flex items-center gap-2 bg-primary hover:bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
          <FaPaw size={18} />
          <span>Explore Our Vet Services</span>
        </button>
      </div>

      {/* Extra Note */}
      <p className="mt-6 text-gray-600 text-sm">
        Discover trusted veterinarians, book appointments, and give your pets the best care they deserve.
      </p>
    </div>
  );
};

export default FindVetsSection;
