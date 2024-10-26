"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/subs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit email');
      }

      const data = await response.json();
      toast.success("Email submitted sucessifully!");
      setEmail('');
    } catch (error) {
      toast.error('Error submitting email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-800 text-white p-4 w-full">
      <ToastContainer />
      <div className="container mx-auto text-center mb-4">
        <p className="text-lg font-semibold mb-4">Contact Us</p>
        <p className="mb-4">123 Apartment St, Suite 101<br />City, State, 12345</p>
        <p className="mb-4">
          Email: <span onClick={() => handleLinkClick('mailto:info@apartmentrental.com')} className="text-blue-400 hover:underline cursor-pointer">info@apartmentrental.com</span>
        </p>
        <p className="mb-4">
          Phone: <span onClick={() => handleLinkClick('tel:+1234567890')} className="text-blue-400 hover:underline cursor-pointer">+1 (234) 567-890</span>
        </p>
      </div>
      
      <div className="container mx-auto text-center mb-4">
        <p className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</p>
        <form onSubmit={handleEmailSubmit} className="flex justify-center mb-4">
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded-md pl-6 border md:w-1/3 w-[100%] border-gray-300 text-semibold  text-slate-700"
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-md ml-2">
            {loading ? (
              <span className="flex items-center">
                <CircularProgress size={20} color="inherit" className="mr-2" />
                Submitting...
              </span>
            ) : (
              'Submit'
            )}
          </button>
        </form>
        
        <p className="text-lg font-semibold mb-4">Follow Us</p>
        <div className="flex justify-center space-x-6 mb-4">
          <span 
            onClick={() => handleLinkClick('https://facebook.com')} 
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            {/* Facebook SVG */}
          </span>
          <span 
            onClick={() => handleLinkClick('https://twitter.com')} 
            className="text-blue-400 hover:text-blue-600 cursor-pointer"
          >
            {/* Twitter SVG */}
          </span>
          <span 
            onClick={() => handleLinkClick('https://instagram.com')} 
            className="text-pink-500 hover:text-pink-700 cursor-pointer"
          >
            {/* Instagram SVG */}
          </span>
        </div>
      </div>
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} ApartmentRental. All rights reserved.</p>
        <p className="text-sm">Designed and developed by Emmanuel</p>
      </div>
    </footer>
  );
};

export default Footer;
