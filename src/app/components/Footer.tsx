import React from "react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto text-center">
        {/* Footer Text */}
        <p className="text-lg mb-4">Built with ❤️ by Vijay Prakash</p>
        <p className="text-sm text-gray-400 mb-6">
          &copy; 2024 Vijay Prakash. All Rights Reserved.
        </p>
        
        {/* Social Media Links */}
        <div className="flex justify-center space-x-6">
          <a
            href="https://x.com/VijayPr4788148"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-indigo-400 transition duration-300"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://github.com/VijayPrakash152"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-indigo-400 transition duration-300"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/me-vijay-prakash"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-indigo-400 transition duration-300"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
