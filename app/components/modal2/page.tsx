"use client";
import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setIsProcessing(true);
    setTimeout(() => {
      console.log('User logged in');
      setIsProcessing(false);
      onClose(); // Close modal after processing
      router.push('/login'); // Redirect after login
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl mb-4 text-blue-600">Please Log In or Register</h2>
        <p className="text-gray-700 mb-4">To submit a property form, you need to be logged in.</p>
        <div className="flex justify-between mt-4">
          <button 
            onClick={onClose} 
            className="bg-transparent border border-gray-400 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition duration-200"
          >
            Close
          </button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLogin} 
            className="rounded-full" 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <CircularProgress size={24} className="mr-2" />
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// New Page Component
const Page: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Welcome to the Page</h1>
      <Button variant="contained" onClick={handleOpenModal}>
        Open Modal
      </Button>

      {isModalOpen && <Modal onClose={handleCloseModal} />} // Conditional rendering of Modal
    </div>
  );
};

export default Page;
