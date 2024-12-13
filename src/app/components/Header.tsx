"use client";
import Link from "next/link";
import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <nav className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center relative">
          {/* Logo */}
          <div className="text-lg font-semibold">
            <img
              src="/logo.png" // Path to your logo image in the 'public' folder
              alt="Logo"
              width="50"
              height="auto"
              className="mx-auto"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="/profile" className="hover:text-indigo-400">
              About Me
            </Link>
            <Link href="/" className="hover:text-indigo-400">
              Posts
            </Link>
            <Link href="/" className="hover:text-indigo-400">
              Categories
            </Link>
          </div>

          {/* Hamburger Icon for Mobile */}
          <button
            className="md:hidden text-white z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              // Cross Icon (X)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 bg-opacity-80 text-white p-6 w-full absolute z-50 transition-all duration-300 ease-in-out">
          <div className="flex flex-col items-center space-y-6">
            <Link
              href="/profile"
              className="text-xl font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              About Me
            </Link>
            <Link
              href="/"
              className="text-xl font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Posts
            </Link>
            <Link
              href="/"
              className="text-xl font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
