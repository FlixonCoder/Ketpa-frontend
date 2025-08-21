import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import { useNavigate, useNavigation } from "react-router-dom";

const Footer = () => {

    const navigate = useNavigate()

  return (
    <footer className="bg-white text-gray-700 mt-16 shadow-sm border-t border-t-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="logo" />
          <p className="text-sm leading-6 text-gray-600">
            Ketpa is your one-stop destination for all pet care needs in
            Bengaluru — from booking vets to finding pets for adoption and
            shopping for quality pet products.
          </p>
          <div className="flex gap-4 mt-4 text-gray-500">
            <a href="#" className="hover:text-blue-500 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-sky-500 transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-700 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-gray-900">Company</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li onClick={()=>{navigate('/'); scrollTo(0,0)}} className="hover:text-gray-900 cursor-pointer">Home</li>
            <li onClick={()=>{navigate('/about'); scrollTo(0,0)}} className="hover:text-gray-900 cursor-pointer">About Us</li>
            <li onClick={()=>{navigate('/contact'); scrollTo(0,0)}} className="hover:text-gray-900 cursor-pointer">Contact Us</li>
            <li onClick={()=>{navigate('/'); scrollTo(0,0)}} className="hover:text-gray-900 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Get In Touch */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-gray-900">Get in Touch</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>+91 9620817650</li>
            <li>ketpa@gmail.com</li>
          </ul>
        </div>

        {/* Developer Branding */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-gray-900">Built By</h3>
          <p className="text-sm text-gray-600">
            Designed & Developed by{" "}
            <span className="text-blue-600 font-semibold">
              Mohammed Saqib Junaid Khan
            </span>
          </p>
          <div className="flex gap-4 mt-4 text-gray-500">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-700 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Ketpa — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
