"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const images = [
    "/images/ap2.jpg",
    "/images/bed2.jpg",
    "/images/int2.jpg",
    "/images/kit2.webp"
];

const captions = [
    "Apartments for rental for students near Universities",
    "Modern bedroom with cozy decor",
    "Stylish living room setup",
    "Well-equipped kitchen for all your cooking needs"
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="relative w-full md:w-4/5 mx-auto overflow-hidden rounded-lg shadow-lg">
            <div className="relative cursor-pointer">
                <div className="flex justify-center">
                    <Image
                        className="w-full h-64 object-cover rounded-lg"
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        width={500}
                        height={300}
                    />
                </div>
                <div className="absolute top-1/2 left-0 flex justify-between w-full transform -translate-y-1/2">
                    <button onClick={handlePrevious} className="bg-gray-300 rounded-full p-2 m-2 hover:bg-gray-400 transition duration-200">❮</button>
                    <button onClick={handleNext} className="bg-gray-300 rounded-full p-2 m-2 hover:bg-gray-400 transition duration-200">❯</button>
                </div>
            </div>
            <div className="absolute top-0 left-0 right-0 flex justify-center items-center h-full">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full mx-1 transition-colors duration-300 ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center h-12">
                <p className={`text-center text-2xl font-semibold bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent`}>
                    {captions[currentIndex]}
                </p>
            </div>
        </div>
    );
};

export default Carousel;
