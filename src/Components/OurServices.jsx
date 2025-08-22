import React from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { Lock } from 'lucide-react'; // Using Lucide for a nice icon
import { useNavigate } from 'react-router-dom';


const ServicesSection = () => {
    const services = [
      { title: 'Vet Services', icon: assets.pet_health, desc: 'Find trusted vets near you and book instantly.', active: true },
      { title: 'Pet Insurance', icon: assets.pet_insurance, desc: 'Protect your pets with reliable coverage plans.', active: false },
      { title: 'Grooming Products', icon: assets.pet_products, desc: 'Shop premium grooming tools and supplies.', active: false },
      { title: 'Adoption Alert', icon: assets.pet_adoption, desc: 'Help pets find their forever homes.', active: false },
    ];

    const navigate = useNavigate()

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-20 text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-12">Our Services</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-primary rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col items-center transition-all transform hover:scale-105"
          >
            <img src={service.icon} alt={service.title} className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-semibold text-white">{service.title}</h3>
            <p className="text-sm text-white mt-2 flex-grow pb-2">{service.desc}</p>

            {service.active ? (
              <a
                onClick={()=>{navigate('/find-vets'), scrollTo(0,0)}}
                className="mt-auto mb-5 bg-white text-primary font-medium py-2 px-4 rounded-lg shadow cursor-pointer hover:bg-gray-100 transition"
              >
                View Service
              </a>
            ) : (
              <button
                disabled
                className="mt-auto mb-5 bg-white text-gray-500 font-medium py-2 px-4 rounded-lg cursor-not-allowed flex items-center gap-2"
              >
                <Lock size={16} /> Coming Soon
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
