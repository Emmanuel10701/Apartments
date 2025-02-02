"use client"; // Ensure this component runs on the client side

import React from 'react';
import Testimony from "../app/components/testimony/page";
import { FaUser, FaSearch, FaFileAlt, FaBriefcase, FaHome, FaKey } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import stepsBg from './../public/assets/bg1.png';
import icon from './../public/assets/bg2.webp';
import Offer1 from './../public/assets/bed11.jpeg';
import Offer2 from './../public/assets/ling.jpeg';
import Offer3 from './../public/assets/kitchen1.jpeg';

const MyPage = () => {
  const stepsData = [
    {
      title: 'Find Your Ideal Home',
      description: 'Browse our extensive listings to discover your next rental or purchase.',
      colorClass: 'bg-orange-100 text-orange-500',
      icon: <FaHome className="w-12 h-12 text-orange-500" />,
    },
    {
      title: 'Schedule a Viewing',
      description: 'Contact landlords or agents to set up viewings at your convenience.',
      colorClass: 'bg-purple-100 text-purple-600',
      icon: <FaSearch className="w-12 h-12 text-purple-600" />,
    },
    {
      title: 'Submit an Application',
      description: 'Fill out the necessary paperwork to apply for your chosen property.',
      colorClass: 'bg-green-100 text-green-600',
      icon: <FaFileAlt className="w-12 h-12 text-green-600" />,
    },
    {
      title: 'Get the Keys!',
      description: 'Complete your agreement and get ready to move into your new home.',
      colorClass: 'bg-red-100 text-red-600',
      icon: <FaKey className="w-12 h-12 text-red-600" />,
    },
  ];

  const offers = [
    {
      id: '1',
      title: 'Expert Advice',
      description: 'Get professional insights on the best neighborhoods and properties.',
      image: Offer1,
    },
    {
      id: '2',
      title: 'Exclusive Listings',
      description: 'Access listings before they hit the market.',
      image: Offer2,
    },
    {
      id: '3',
      title: 'Negotiation Support',
      description: 'Let us help you negotiate the best deal possible.',
      image: Offer3,
    },
  ];

  const router = useRouter();

  return (
    <div className="font-poppins">
  {/* Navigation */}
  <header className="relative text-center py-16 bg-cover bg-center w-full flex items-center justify-center" style={{ backgroundImage: "url('/chicago.avif')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
    {/* Semi-transparent overlay */}
    <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

    <div className="relative flex flex-col items-center justify-center mx-4 md:mx-20 mt-20 z-20">
      <h1 className="mb-4 text-4xl md:text-5xl font-bold text-white">
        Discover Your Perfect <span className="text-purple-600">Rental</span> Match
      </h1>

      <p className="mb-8 max-w-xl mx-auto text-gray-300 leading-relaxed text-center text-base md:text-lg">
        Join thousands of renters finding their ideal homes. Our platform connects you with top listings across the country.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4 mt-6 mb-8 z-20">
        <Link href="/dashboard">
          <button className="px-5 py-2 font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition duration-300 z-20">
            Post a Listing
          </button>
        </Link>
        <Link href="/homepage">
          <button className="px-5 py-2 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300 z-20">
            Find a Home
          </button>
        </Link>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto w-full rounded-full mt-16 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          Our Statistics
        </h2>
        <div className="flex flex-col md:flex-row bg-white flex-wrap justify-center relative z-10">
          <div className="flex-1 p-2 max-w-xs m-2 bg-white shadow-sm rounded-lg text-center z-10">
            <h3 className="text-2xl font-bold text-purple-600">150k</h3>
            <p className="text-slate-700 font-bold text-sm">Happy Tenants</p>
          </div>
          <div className="flex-1 p-2 max-w-xs m-2 bg-white shadow-sm rounded-lg text-center z-10">
            <h3 className="text-2xl font-bold text-green-600">75M+</h3>
            <p className="text-slate-700 font-bold text-sm">Rental Transactions</p>
          </div>
          <div className="flex-1 p-2 max-w-xs m-2 bg-white shadow-sm rounded-lg text-center z-10">
            <h3 className="text-2xl font-bold text-blue-600">50k</h3>
            <p className="text-slate-700 font-bold text-sm">Student Accommodations</p>
          </div>
          <div className="flex-1 p-2 max-w-xs m-2 bg-white shadow-sm rounded-lg text-center z-10">
            <h3 className="text-2xl font-bold text-red-600">300k</h3>
            <p className="text-slate-700 font-bold text-sm">Listings Available</p>
          </div>
        </div>

        <h2 className="inline-flex items-center justify-center gap-2 px-4 py-2 my-6 text-orange-500 bg-orange-100 rounded-full z-20">
          <Image src={icon} alt="icon" width={24} height={24} />
          Find Your Dream Home Today!
        </h2>
      </div>
    </div>
  </header>
</div>

  );
};

export default MyPage;
