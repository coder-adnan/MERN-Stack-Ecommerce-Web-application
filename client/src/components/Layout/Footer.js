import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <img
              src="http://localhost:3000/assets/footerlogo.png"
              alt="Logo"
              className="w-60 h-24 mr-2"
            />
            <h1 className="text-2xl font-bold">FYP Ecommerce</h1>
          </div>
          <p className="text-center mt-4 md:mt-0">
            <Link to="/about" className="mr-4">
              About
            </Link>
            <Link to="/contact" className="mr-4">
              Contact
            </Link>
            <Link to="/policy">Privacy Policy</Link>
          </p>
        </div>
        <div className="flex justify-center">
          <hr className="my-6 h-px border-gray-600" />
        </div>

        <div className="flex flex-col justify-evenly">
          <div className="flex justify-center">
            <p className="text-sm">Personal portfolio,</p>
            <p>
              <a
                className="text-blue-400 text-sm ml-2 underline underline-offset-4"
                href="codewithadnan.com"
              >
                codewithadnan.com
              </a>
            </p>
          </div>
          <p className="text-center text-sm">
            For Any queries, contact@codewithadnan.com
          </p>
        </div>
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} FYP Project Ecommerce MERN STACK WEB
          APP. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
