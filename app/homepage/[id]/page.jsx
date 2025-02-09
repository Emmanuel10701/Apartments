"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress';
import EmailModal from "../../components/emailModal";

const ApartmentDetail = () => {
    const { id } = useParams();
    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [imageIndex, setImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apartmentsData, setApartmentsData] = useState([]);

    const fetchApartmentData = async () => {
        const response = await fetch('/data.json');
        const data = await response.json();
        return data;
    };

    useEffect(() => {
        const getApartment = async () => {
            const data = await fetchApartmentData();
            setApartmentsData(data); // Store all apartments data
            if (id) {
                const apartmentFound = data.find((apt) => apt.id.toString() === id);
                if (apartmentFound) {
                    setApartment(apartmentFound);
                    setMainImage(apartmentFound.images[0] || '');
                } else {
                    console.error('Apartment not found');
                }
            }
            setLoading(false);
        };

        getApartment();
    }, [id]);

    const handleImageClick = (index) => {
        if (apartment) {
            setMainImage(apartment.images[index]);
            setImageIndex(index);
        }
    };

    const openEmailModal = () => {
        setIsModalOpen(true);
    };

    const closeEmailModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (!apartment) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                    No apartment found.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto p-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                {apartment.title}
            </h1>
            <div className="relative flex-col  gap-2">
                <div className="md:flex flex-col  gap-3 p-4   md:gap-6 md:p-8">
                    <Image
                        src={mainImage}
                        alt={apartment.title}
                        width={800}
                        height={500}
                        className="rounded-lg -z-1000  cursor-pointer mt-4 md:w-full md:h-[500px]"
                    />
                    <div className="flex flex-wrap p-3 -z-10 gap-3 md:gap-6 md:p-8">
                        {apartment.images.map((image, index) => (
                            index !== imageIndex && (
                                <div className="flex-1" key={index}>
                                    <Image
                                        src={image}
                                        alt={apartment.title}
                                        width={400}
                                        height={300}
                                        className="rounded-lg -z-1000 cursor-pointer w-full h-full object-cover"
                                        onClick={() => handleImageClick(index)}
                                    />
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>

            <div className='md:w-[70%] mx-auto w-full shadow-lg rounded-lg'>
                <div className="p-4 bg-white">
                    <div className="flex items-center mt-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className="ml-2 text-lg font-semibold text-gray-800">{apartment.location}</span>
                    </div>

                    <div className="flex items-center mt-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                                <FaStar key={index} className={`w-4 h-4 ${index < apartment.rating ? 'text-yellow-300' : 'text-gray-200'}`} />
                            ))}
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-3">{apartment.rating}</span>
                    </div>

                    <div className="mt-2">
                        <span className="text-blue-800 text-md font-semibold">{apartment.description}</span>
                        <div>
                            <span>Modern Accommodation for Students and Young Professionals</span>
                            <p>Welcome to your new home—a vibrant and stylish accommodation designed to meet the needs of students and young professionals alike. Our space offers a unique blend of comfort and community, providing an ideal environment for study, work, and socializing.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4">
  <span className="text-3xl sm:text-2xl font-bold text-green-600">
    ${apartment.price}/month
  </span>
  <span className="text-sm sm:text-base text-gray-500 mt-2 sm:mt-0">
    Min Price: <span className="text-gray-800 font-semibold">${apartment.minPrice}</span>
  </span>
</div>


                    <div className="flex justify-center mt-4">
                        <button
                            className="bg-transparent border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-full hover:bg-blue-600 hover:text-white transition duration-300"
                            onClick={() => window.open(`tel:${apartment.phoneNumber}`)}
                        >
                            Call
                        </button>
                        <button
                            className="bg-transparent border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-full hover:bg-blue-600 hover:text-white transition duration-300 ml-4"
                            onClick={openEmailModal}
                        >
                            Email
                        </button>
                    </div>
                </div>
            </div>

            {/* Email Modal */}
            <EmailModal isOpen={isModalOpen} onClose={closeEmailModal} apartment={apartment} />

            {/* Related apartments section */}
            <h2 className="text-4xl text-center my-4 font-bold mt-6 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 text-transparent bg-clip-text">
                Related Apartments
            </h2>
            <div className="flex w-full md:w-2/3 flex-row gap-6 mx-auto overflow-x-auto">
                {apartmentsData.slice(0, 4).map((relatedApartment) => {
                    if (relatedApartment.id === apartment.id) return null;

                    return (
                        <Link href={`/homepage/${relatedApartment.id}`} key={relatedApartment.id}>
                            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-72 cursor-pointer hover:shadow-lg transition-shadow duration-300">
                                <Image
                                    src={relatedApartment.images[0] || ''}
                                    alt={relatedApartment.title}
                                    width={400}
                                    height={300}
                                    className="rounded-lg h-40 object-cover"
                                />
                                <h3 className="font-bold text-md mt-2 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                                    {relatedApartment.title}
                                </h3>
                                <p className="font-bold text-lg text-gray-800">${relatedApartment.price}/month</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ApartmentDetail;
