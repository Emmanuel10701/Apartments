"use client"; // Keep this at the top for client-side rendering

import React, { useState } from 'react';
import Image from 'next/image';

const testimonies = [
  {
    title: 'Alice Johnson',
    description: 'Thanks to this platform, I found the perfect rental apartment in no time! Highly recommend!',
    image: '/assets/client-1.jpg',
  },
  {
    title: 'David Brown',
    description: 'The resources provided helped me sell my house quickly and at a great price. Truly valuable!',
    image: '/assets/client-2.jpg',
  },
  {
    title: 'Emma Wilson',
    description: 'I received multiple offers on my property within days of listing it here. Fantastic experience!',
    image: '/assets/client-3.jpg',
  },
];

const TestimonySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimony = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonies.length);
  };

  const prevTestimony = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonies.length) % testimonies.length);
  };

  return (
    <section className="py-16 mx-4 px-4 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="md:text-4xl text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          What Our Clients Say About Us{' '}
          <span className="md:text-5xl text-3xl text-orange-500">in Real Estate</span>
        </h1>
        <p className="text-lg mb-12">Discover how our platform has helped countless clients achieve their real estate goals.</p>

        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-4 transition-opacity duration-500 ease-in-out opacity-100">
            <Image
              src={testimonies[currentIndex].image}
              width={96}
              height={96}
              className="object-cover rounded-full"
              alt="client"
            />
          </div>
          <h4 className="mb-2 text-lg font-bold text-gray-900">{testimonies[currentIndex].title}</h4>
          <div className="mb-2 text-yellow-500 text-lg">⭐⭐⭐⭐</div>
          <p className="text-gray-500">{testimonies[currentIndex].description}</p>
        </div>

        <div className="flex justify-center space-x-4">
          <button onClick={prevTestimony} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            &lt; Previous
          </button>
          <button onClick={nextTestimony} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Next &gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonySection;
