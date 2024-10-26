"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ApartmentList = () => {
    const { data: session } = useSession();
    const [apartments, setApartments] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 1;
    const [loading, setLoading] = useState(true);
    const [editingApartment, setEditingApartment] = useState(null);
    const [formData, setFormData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchApartments = async () => {
            if (session?.user?.email) {
                const response = await fetch(`/api/Apartment/${session.user.email}`);
                const data = await response.json();
                setApartments(data);
            }
            setLoading(false);
        };

        fetchApartments();
    }, [session]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % 4); // Adjust based on actual number of images
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const totalPages = Math.ceil(apartments.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const displayedApartments = Array.isArray(apartments) 
        ? apartments.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) 
        : [];

    const handleEditClick = (apartment) => {
        setEditingApartment(apartment);
        setFormData(apartment);
    };

    const handleInputChange = (e) => {
        if (formData) {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleUpdateApartment = async () => {
        if (formData) {
            const { kitchenImage, livingRoomImage, bedroomImage, apartmentImage, ...updatedData } = formData;

            const response = await fetch(`/api/Apartment/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const updatedApartment = await response.json();
                setApartments((prev) => prev.map((apt) => (apt.id === updatedApartment.id ? updatedApartment : apt)));
                setEditingApartment(null);
                setFormData(null);
                toast.success("Apartment updated successfully!");
            } else {
                toast.error("Failed to update apartment.");
            }
        }
    };

    const handleDeleteApartment = async (apartmentId) => {
        const response = await fetch(`/api/Apartment/${apartmentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setApartments((prev) => prev.filter((apt) => apt.id !== apartmentId));
            toast.success("Apartment deleted successfully!");
        } else {
            toast.error("Failed to delete apartment.");
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <ToastContainer />
            {apartments.length === 0 ? (
                <div className="text-center mt-[29%]">
                    <h2 className="text-3xl bg-gradient-to-r from-purple-500 via-orange-500 to-indigo-500">
                        You Have No Apartments
                    </h2>
                    <p className="text-gray-500 mt-2">Start adding apartments to your dashboard!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {displayedApartments.map((apartment) => (
                        <div key={apartment.id} className="w-full border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-4">
                            <div className="relative w-full h-44">
                                <Image
                                    className="w-full h-full object-cover"
                                    src={apartment.apartmentImage}
                                    alt={`Image of ${apartment.name}`}
                                    width={240}
                                    height={160}
                                />
                            </div>
                            <div className="p-4 h-full flex flex-col justify-between">
                                {editingApartment?.id === apartment.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData?.name || ''}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-lg w-full mb-2 p-3 transition duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-sm hover:shadow-md hover:border-indigo-400"
                                            placeholder="Apartment Name"
                                        />
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData?.address || ''}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-lg w-full mb-2 p-3 transition duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-sm hover:shadow-md hover:border-indigo-400"
                                            placeholder="Address"
                                        />
                                        <input
                                            type="number"
                                            name="minPrice"
                                            value={formData?.minPrice || ''}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-lg w-full mb-2 p-3 transition duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-sm hover:shadow-md hover:border-indigo-400"
                                            placeholder="Minimum Price"
                                        />
                                        <input
                                            type="number"
                                            name="maxPrice"
                                            value={formData?.maxPrice || ''}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-lg w-full mb-2 p-3 transition duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-sm hover:shadow-md hover:border-indigo-400"
                                            placeholder="Maximum Price"
                                        />
                                        <div className="flex justify-between mt-4">
                                            <button 
                                                onClick={handleUpdateApartment} 
                                                className="bg-transparent text-green-600 border border-green-600 rounded-full px-4 py-2 hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white transition-all duration-200 w-full mr-2"
                                            >
                                                Update
                                            </button>
                                            <button 
                                                onClick={() => setEditingApartment(null)} 
                                                className="bg-transparent text-red-600 border border-red-600 rounded-full px-4 py-2 hover:bg-orange-500 hover:text-white focus:bg-orange-500 focus:text-white transition-all duration-200 w-full"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full mx-auto">
                                        <h5 className="text-xl font-bold text-slate-600">{apartment.name}</h5>
                                        <div className="flex items-center mt-2 mb-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, index) => (
                                                    <FaStar key={index} className={`w-4 h-4 ${index < apartment.starRating ? 'text-yellow-300' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                            <span className="ml-2 text-sm text-slate-600">{apartment.starRating}</span>
                                        </div>
                                        <div className="flex items-center text-slate-600 mb-2">
                                            <FaMapMarkerAlt className="text-red-500 mr-1" />
                                            <span>{apartment.address}</span>
                                        </div>
                                        <p className="text-slate-600 text-md font-bold">Rooms: <span className="font-bold text-purple-700">{apartment.availableRooms} | Type: {apartment.rentalType}</span></p>
                                        <div className="flex justify-between">
                                            <p className="text-slate-600 text-md font-bold">Min Price: ${apartment.minPrice}</p>
                                            <p className="text-slate-600 text-md font-bold">Max Price: ${apartment.maxPrice}</p>
                                        </div>

                                        <div className="flex justify-between mt-4">
                                            <button 
                                                onClick={() => handleEditClick(apartment)} 
                                                className="bg-transparent text-indigo-600 border border-indigo-600 rounded-full px-4 py-2 hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white transition-all duration-200 w-full mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteApartment(apartment.id)} 
                                                className="bg-transparent text-red-600 border border-red-600 rounded-full px-4 py-2 hover:bg-orange-500 hover:text-white focus:bg-orange-500 focus:text-white transition-all duration-200 w-full"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {totalPages > 1 && apartments.length > 0 && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`mx-1 px-4 py-2 rounded-full ${currentPage === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200'}`}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => {
                        if (index === 0 || index === totalPages - 1 || (index >= currentPage - 1 && index <= currentPage + 1)) {
                            return (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index)}
                                    className={`mx-1 px-3 py-1 rounded-full ${currentPage === index ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-indigo-500 hover:text-white transition duration-200'}`}
                                >
                                    {index + 1}
                                </button>
                            );
                        }

                        if (index === 1 && currentPage > 2) {
                            return <span key={index} className="mx-1 text-gray-500">...</span>;
                        }

                        if (index === totalPages - 2 && currentPage < totalPages - 3) {
                            return <span key={index} className="mx-1 text-gray-500">...</span>;
                        }

                        return null; // Skip other pages
                    })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`mx-1 px-4 py-2 rounded-full ${currentPage === totalPages - 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200'}`}
                        disabled={currentPage === totalPages - 1}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ApartmentList;
