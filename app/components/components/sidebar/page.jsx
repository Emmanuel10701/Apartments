"use client";

import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaChevronDown, FaChevronUp, FaHome, FaList, FaInfoCircle, FaPhone, FaTachometerAlt } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { name: 'Home', href: '/', icon: <FaHome className="text-blue-500" /> },
  { name: 'Contact', href: '/contact', icon: <FaPhone className="text-red-500" /> },
  { name: 'Dashboard', href: '/dashboard', icon: <FaTachometerAlt className="text-purple-500" /> },
];

const Sidebar = ({ isMenuOpen, toggleMenu }) => {
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);
  const [isListingsDropdownOpen, setIsListingsDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const path = usePathname();
  const router = useRouter();

  const toggleDashboardDropdown = () => setIsDashboardDropdownOpen(!isDashboardDropdownOpen);
  const toggleListingsDropdown = () => setIsListingsDropdownOpen(!isListingsDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, toggleMenu]);

  const handleLinkClick = (href) => {
    router.push(href);
    // Uncomment if you want the sidebar to close when a link is clicked
    // toggleMenu();
  };

  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      ref={menuRef}
    >
      <button
        className="absolute top-4 right-4 text-black"
        onClick={toggleMenu}
        aria-label="Close menu"
      >
        <FaTimes className="w-6 h-6" />
      </button>
      <div className="flex flex-col items-start p-4 mt-10">
        <ul className="flex flex-col space-y-12">
          {LINKS.map((link) => {
            if (link.name === 'Dashboard') {
              return (
                <li key={link.href} className="flex flex-col">
                  <button
                    className={`flex items-center w-full text-black text-xl font-bold transition duration-300 hover:text-gray-700 cursor-pointer ${link.href === path ? 'text-blue-500' : ''}`}
                    onClick={toggleDashboardDropdown}
                  >
                    <span className="flex-1 flex items-center">
                      {link.icon}
                      <span className="ml-2">{link.name}</span>
                    </span>
                    {isDashboardDropdownOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                  </button>
                  <div className={`pl-8 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg ${isDashboardDropdownOpen ? 'block' : 'hidden'}`}>
                    <ul className="space-y-2">
                      <li>
                        <span
                          className="block px-4 py-2 text-purple-500 text-lg font-bold hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleLinkClick('/dashboard/overview')}
                        >
                          Overview
                        </span>
                      </li>
                      <li>
                        <span
                          className="block px-4 py-2 text-purple-500 text-lg font-bold hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleLinkClick('/dashboard/settings')}
                        >
                          Settings
                        </span>
                      </li>
                    </ul>
                  </div>
                </li>
              );
            }

            if (link.name === 'Listings') {
              return (
                <li key={link.href} className="flex flex-col">
                  <button
                    className={`flex items-center w-full text-black text-xl font-bold transition duration-300 hover:text-gray-700 cursor-pointer ${link.href === path ? 'text-blue-500' : ''}`}
                    onClick={toggleListingsDropdown}
                  >
                    <span className="flex-1 flex items-center">
                      {link.icon}
                      <span className="ml-2">{link.name}</span>
                    </span>
                    {isListingsDropdownOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                  </button>
                  <div className={`pl-8 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg ${isListingsDropdownOpen ? 'block' : 'hidden'}`}>
                    <ul className="space-y-2">
                      <li>
                        <span
                          className="block px-4 py-2 text-purple-500 text-lg font-bold hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleLinkClick('/listings/sell')}
                        >
                          Sell Listings
                        </span>
                      </li>
                      <li>
                        <span
                          className="block px-4 py-2 text-purple-500 text-lg font-bold hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleLinkClick('/listings/rent')}
                        >
                          Rent Listings
                        </span>
                      </li>
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={link.href} className="flex items-center">
                <span
                  className={`text-black text-xl font-bold transition duration-300 hover:text-gray-700 cursor-pointer flex items-center ${link.href === path ? 'text-blue-500' : ''}`}
                  onClick={() => handleLinkClick(link.href)}
                >
                  <span className="flex-1 flex items-center">
                    {link.icon}
                    <span className="ml-2">{link.name}</span>
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
