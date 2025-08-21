import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const WhoAreWe = () => {
  return (
    <div
      className="relative h-[500px] flex flex-col items-center rounded-lg justify-center text-white py-16 px-6 md:px-10"
      style={{
        backgroundImage: `url(${assets.hero_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0"></div>

      <div className="relative max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Who are we?</h2>
        <p className="text-white text-sm md:text-base leading-relaxed">
          Ketpa is an integrated online platform dedicated to simplifying and
          enriching the pet ownership experience for the vibrant community of
          pet lovers in Bengaluru. We provide everything pet owners need in a
          single, user-friendly space — from connecting with verified vets to
          finding pets for adoption and shopping for high-quality pet products.
        </p>
      </div>
    </div>
  );
};

export default WhoAreWe;
