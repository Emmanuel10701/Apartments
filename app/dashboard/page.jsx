"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import Card from "../components/DashCard/page";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import CircularProgress from '@mui/material/CircularProgress';
import {
  FaEnvelope,
  FaCalendarCheck,
  FaUsers,
  FaDollarSign,
  FaSearch,
  FaFilter,
  FaChevronRight,
  FaPlus,
  FaTimes,
  FaArrowLeft,
} from 'react-icons/fa';

const EmailModal = ({ isOpen, onClose, onSend }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(subject, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg md:w-[35%] w-[80%] shadow-xl mt-20">
        <h2 className="text-xl mb-4">Send Email to Subscribers</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border p-2 outline-emerald-500 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border p-2 outline-indigo-500 resize-none w-full"
              required
            />
          </div>
          <div className='flex justify-evenly'>
            <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">
              Send Email
            </button>
            <button onClick={onClose} className="px-4 py-2 text-white bg-slate-500 rounded-md">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [searchFormVisible, setSearchFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({
    name: '',
    imageUrl: '',
    address: '',
    roomsAvailable: 1,
  });
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState('');
  const [subscribers, setSubscribers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const route = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 576) {
        setSearchFormVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/subs');
        if (!response.ok) throw new Error('Failed to fetch subscribers');
        const data = await response.json();
        setSubscribers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  useEffect(() => {
    if (session && !user) {
      setUser(session.user);
    }
  }, [session, user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendEmail = async (subject, message) => {
    try {
      const response = await fetch('/api/Milling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, subscribers }),
      });
      if (!response.ok) throw new Error('Failed to send emails');
      toast.success('Emails sent successfully!');
    } catch (error) {
      toast.error('Error sending emails: ' + error.message);
    }
  };

  if (!session) {
    return (
      <div className='flex items-center justify-center'>
        <div className="flex flex-col items-center justify-center mt-20 w-full max-w-md p-6 border border-gray-300 rounded-xl shadow-lg bg-white mx-auto my-4">
          <h2 className="text-2xl font-bold">Please Log In</h2>
          <p className="mt-2 text-gray-600">You need to log in to access this page. Security is needed</p>
          <button
            className={`mt-4 w-full py-2 rounded-full transition-all duration-300 ${loading ? 'border border-blue-600 bg-blue-600 text-white' : 'border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white'}`}
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                window.location.href = '/login';
              }, 2000);
            }}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <CircularProgress size={24} color="inherit" className="mr-2" />
                <span>Processing...</span>
              </div>
            ) : (
              'Go to Login'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {searchFormVisible && (
        <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={() => setSearchFormVisible(false)}></div>
      )}

      <div className={`flex-1 transition-all duration-300`}>
        <nav className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-20">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center bg-slate-600 text-white rounded-full px-4 py-2 shadow-md hover:bg-slate-500 transition-colors duration-200 transform hover:scale-105"
            >
              <FaArrowLeft className="text-2xl" />
              <span className="ml-2 text-lg text-white font-semibold">Back</span>
            </Link>
          </div>

          <div className="relative">
            <button
              onClick={() => document.getElementById('profileImageInput')?.click()}
              className="focus:outline-none"
            >
              <Image src={userImage || "/default.png"} alt="Profile" width={20} height={20} className="w-12 p-1 h-12 bg-slate-300 rounded-full" />
            </button>
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </nav>

        <main className="p-6 bg-gray-100 min-h-screen">
          <div className="flex items-center justify-between flex-wrap mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-poppins font-semibold text-gray-800">Dashboard</h1>
              <ul className="flex items-center space-x-2 text-gray-600">
                <li>
                  <Link href="/" className="text-lg hover:underline">Dashboard</Link>
                </li>
                <li>
                  <FaChevronRight />
                </li>
                <li>
                  <Link href="/" className="text-blue-500 text-lg hover:underline">Home</Link>
                </li>
              </ul>
              <button 
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:text-base md:text-lg px-4 sm:px-5 py-2.5 text-center transition duration-200 ease-in-out"
              >
                <Link href="/fillingform">Add property</Link>
              </button>
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent text-2xl bg-clip-text">
              Welcome back <span className='text-3xl font-extrabold'>{user?.name}</span>
            </h1>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <li className="flex items-center p-6 bg-blue-100 text-blue-600 rounded-2xl">
              <FaCalendarCheck className="text-4xl" />
              <div className="ml-4">
                <h3 className="text-2xl font-semibold">1020</h3>
                <p className="text-lg">New Email Request</p>
              </div>
            </li>
            <li className="flex items-center p-6 bg-yellow-100 text-yellow-600 rounded-2xl">
              <FaUsers className="text-4xl" />
              <div className="ml-4">
                <h3 className="text-2xl font-semibold">2834</h3>
                <p className="text-lg">Active Visitors</p>
              </div>
            </li>
            <li className="flex items-center p-6 bg-orange-100 text-orange-600 rounded-2xl">
              <FaDollarSign className="text-4xl" />
              <div className="ml-4">
                <h3 className="text-2xl font-semibold">$2543</h3>
                <p className="text-lg">Total income</p>
              </div>
            </li>
          </ul>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">Recent Subscribers</h3>
                <div className="flex space-x-2">
                  <FaSearch className="text-lg text-gray-600 cursor-pointer" />
                  <FaFilter className="text-lg text-gray-600 cursor-pointer" />
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-slate-100 bg-green-600 cursor-pointer hover:bg-green-700 ml-3 flex items-center border-2 rounded-full px-5 py-2 transition duration-300"
                >
                  <FaEnvelope className="mr-1" /> Email
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-300">
                    <th className="pb-2 text-lg">User</th>
                    <th className="pb-2 text-lg">Date Added</th>
                    <th className="pb-2 text-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber, index) => (
                    <tr key={subscriber.id} className={`${index % 2 === 0 ? 'bg-indigo-50' : 'bg-green-50'} hover:bg-indigo-100 transition duration-200`}>
                      <td className="py-4">{subscriber.email}</td>
                      <td className="py-4">{moment(subscriber.createdAt).fromNow()}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex-1 bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-center text-gray-800 text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">Your Properties</h3>
                <div className="flex space-x-2">
                  <FaPlus className="text-lg text-gray-600 cursor-pointer" onClick={() => { /* Add additional functionality here */ }} />
                  <FaFilter className="text-lg text-gray-600 cursor-pointer" />
                </div>
              </div>
              <div className='items-center justify-center flex'>
                <Card />
              </div>
            </div>
          </div>
        </main>
        <ToastContainer />
        <EmailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSend={handleSendEmail} />
      </div>
    </div>
  );
}

export default Dashboard;
