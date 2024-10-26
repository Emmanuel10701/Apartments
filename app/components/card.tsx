"use client";

import { useState } from 'react';
import EmailModal from "./emailModal";
import Image from 'next/image';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

interface Apartment {
    id: number;
    title: string;
    images: string[];
    rating: number;
    location: string;
    availableRooms: number;
    rentalType: string;
    description: string;
    price: number;
    minPrice: number;
    phoneNumber: string;
    email: string;
}

interface ApartmentCardProps {
    apartment: Apartment;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEmailClick = () => {
        setIsModalOpen(true);
    };

    const handleCallClick = () => {
        window.location.href = `tel:${apartment.phoneNumber}`;
    };

    const goToPreviousImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? apartment.images.length - 1 : prevIndex - 1));
    };

    const goToNextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === apartment.images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="w-full max-w-xs h-full bg-white border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-4">
            <div className="relative cursor-pointer h-44">
                <Image
                    className="w-full h-full object-cover"
                    src={apartment.images[currentIndex]}
                    alt={`Image of ${apartment.title}`}
                    width={240}
                    height={160}
                />
                <button 
                    onClick={goToPreviousImage} 
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-lg">
                    <FaChevronLeft className="text-gray-700" />
                </button>
                <button 
                    onClick={goToNextImage} 
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-lg">
                    <FaChevronRight className="text-gray-700" />
                </button>
            </div>
            <div className="p-4 h-full flex flex-col justify-between">
                <div>
                    <h5 className="text-xl font-bold text-slate-600">{apartment.title}</h5>
                    <div className="flex items-center mt-2 mb-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                                <FaStar key={index} className={`w-4 h-4 ${index < apartment.rating ? 'text-yellow-300' : 'text-gray-200'}`} />
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-slate-600">{apartment.rating}</span>
                    </div>
                    <div className="flex items-center text-slate-600 mb-2">
                        <FaMapMarkerAlt className="text-red-500 mr-1" />
                        <span>{apartment.location}</span>
                    </div>
                    <p className="text-slate-600">Rooms: {apartment.availableRooms} | Type: {apartment.rentalType}</p>
                    <p className="mt-2 text-slate-600">{apartment.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl flex justify-around items-center font-bold text-slate-600">
                        ${apartment.price}/month
                        <span className="line-through text-md text-gray-500 ml-2">${apartment.minPrice}</span>
                    </span>
                </div>
                <Link href={`/homepage/${apartment.id}`} className="mt-2 inline-block text-indigo-600 font-bold hover:underline">
                    Visit to see the apartment
                </Link>
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-50">
                <button onClick={handleCallClick} className="bg-indigo-600 text-white rounded-full px-4 py-2 mr-2">
                    <FaPhone className="inline" /> Call
                </button>
                <button onClick={handleEmailClick} className="bg-green-600 text-white rounded-full px-4 py-2">
                    <FaEnvelope className="inline" /> Email
                </button>
            </div>
            {isModalOpen && (
                <EmailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} apartment={apartment} />
            )}
        </div>
    );
};

export default ApartmentCard;
