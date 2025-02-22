"use client";

import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaChevronDown, FaChevronUp, FaHome, FaPhone, FaTachometerAlt } from 'react-icons/fa'; // Import necessary icons
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { name: 'Home', href: '/', icon: <FaHome className="text-blue-500" /> },
  { name: 'Contact', href: '/contact', icon: <FaPhone className="text-red-500" /> },
  { name: 'Dashboard', href: '/dashboard', icon: <FaTachometerAlt className="text-purple-500" /> },
];

const Sidebar = ({ isMenuOpen, toggleMenu }) => {
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const path = usePathname();
  const router = useRouter();

  const toggleDashboardDropdown = () => setIsDashboardDropdownOpen(!isDashboardDropdownOpen);

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
    // Uncomment the line below if you want the sidebar to close when a link is clicked
    // toggleMenu();
  };

  return (
    
    <div
    className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-100`}
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
        <ul className="flex flex-col space-y-12"> {/* Increased spacing here */}
          {LINKS.map((link) => (
            <li key={link.href} className="flex flex-col">
              {link.name === 'Dashboard' ? (
                <>
                  <button
                    className={`flex items-center w-full text-black text-xl font-bold transition duration-300 hover:text-gray-700 cursor-pointer ${link.href === path ? 'text-blue-500' : ''}`}
                    onClick={toggleDashboardDropdown}
                  >
                    <span className="flex-1 flex items-center">
                      {link.icon}
                      <span className="ml-2">{link.name}</span>
                    </span>
                    <FaChevronDown className={`ml-2 ${isDashboardDropdownOpen ? 'hidden' : 'block'}`} />
                    <FaChevronUp className={`ml-2 ${isDashboardDropdownOpen ? 'block' : 'hidden'}`} />
                  </button>
                  {isDashboardDropdownOpen && (
                    <div className="pl-8 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                      <ul className="space-y-2">
                        <li>
                          <span
                            className="block px-4 py-2 text-slate-400 text-xl font-bold hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleLinkClick('/dashboard')}
                          >
                            Overview
                          </span>
                        </li>
                        <li>
                          <span
                            className="block px-4 py-2 text-slate-400 text-xl font-bold hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleLinkClick('/dashboard')}
                          >
                            Settings
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <span
                  className={`flex items-center text-slate-400 text-xl font-bold transition duration-300 hover:text-gray-700 cursor-pointer ${link.href === path ? 'text-blue-500' : ''}`}
                  onClick={() => handleLinkClick(link.href)}
                >
                  {link.icon}
                  <span className="ml-2">{link.name}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
