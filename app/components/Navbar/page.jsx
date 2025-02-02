"use client";

import React, { useState } from 'react';
import { CiMenuBurger } from "react-icons/ci";
import { useRouter } from 'next/navigation';
import Sidebar from '../sidebar/page';
import { useSession, signOut } from 'next-auth/react'; // Import useSession and signOut

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession(); // Get session data

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-slate-100 shadow-md mb-20">
      <nav className="flex w-full items-center fixed top-0 z-100 right-0 justify-between bg-zinc-50 py-2 shadow-dark-mild dark:bg-neutral-700 lg:py-4">
        <div className="flex w-full items-center justify-between px-3">
          {/* Hamburger Menu Button */}
          <button
            className="block border-0 bg-transparent px-3 text-black/50 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:ring-0 dark:text-neutral-200"
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <CiMenuBurger className="w-8 h-8 bg-slate-300 hover:bg-slate-400 rounded-md p-1 font-extrabold stroke-black/100 focus:outline-2 dark:stroke-neutral-700" />
          </button>

          {/* Sidebar */}
          <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

          {/* Button Group */}
          <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-4">
            {!session ? (
              <>
                <span
                  className="px-4 py-2 border border-transparent text-purple-700 font-semibold rounded-lg hover:border-black hover:bg-purple-50 transition cursor-pointer"
                  onClick={() => router.push('/login')}
                >
                  Sign In
                </span>
                <span
                  className="px-4 py-2 border border-transparent text-purple-700 font-semibold rounded-lg hover:border-black hover:bg-purple-50 transition cursor-pointer"
                  onClick={() => router.push('/register')}
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                <span className="text-purple-700 font-semibold">
                  Hi, {session.user?.name} {/* Display user's name */}
                </span>
                <span
                  className="relative px-4 py-2 border border-transparent text-purple-700 font-semibold rounded-lg hover:border-black hover:bg-purple-50 transition cursor-pointer"
                  onClick={() => router.push('/fillingform')}
                >
                  Add Property
                </span>
                <span
                  className="px-4 py-2 border border-transparent text-red-700 font-semibold rounded-lg hover:border-black hover:bg-red-50 transition cursor-pointer"
                  onClick={() => signOut()} // Logout functionality
                >
                  Logout
                </span>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
