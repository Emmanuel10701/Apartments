"use client";

import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);  // State for social login loading
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        toast.error(errorMessage);
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error) => {
    if (error.includes("No user found")) {
      return "User does not exist. Please check your email.";
    }
    if (error.includes("Incorrect password")) {
      return "Incorrect password. Please try again.";
    }
    return "An unexpected error occurred. Please try again.";
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(true);  // Start loading for social login
    try {
      await signIn(provider);
    } catch (error) {
      toast.error("Social login failed. Please try again.");
    } finally {
      setSocialLoading(false);  // Stop loading once the sign-in process is finished
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-full max-w-xl p-12 bg-white shadow-lg rounded-lg mb-8">
          <h2 className="text-4xl font-extrabold text-center mb-6 text-slate-600">
            🔒 Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Email Address"
                required
              />
              <FaEnvelope className="absolute left-3 top-3 text-gray-500 text-xl" />
            </div>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Password"
                required
              />
              <FaLock className="absolute left-3 top-3 text-gray-500 text-xl" />
              <div
                className="absolute right-3 top-3 cursor-pointer text-xl text-gray-500"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <div className="text-end mt-4">
              <Link href="/forgot">
                <span className="text-blue-500 hover:underline">
                  Forgot Password?
                </span>
              </Link>
            </div>
            <button
              type="submit"
              className={`w-full py-4 bg-blue-500 text-white font-bold rounded-lg ${loading ? "border-2 border-indigo-800" : ""} hover:bg-blue-600 transition-colors relative`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-white">Processing...</span>
                  <CircularProgress size={24} color="inherit" style={{ color: "white" }} />
                </div>
              ) : (
                "Sign In"
              )}
            </button>
            {/* Google Sign-In */}
            <button
              onClick={() => handleSocialLogin("google")}
              className="flex items-center mt-4 justify-center w-full py-3 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 transition"
              disabled={socialLoading}
            >
              {socialLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  <FcGoogle className="text-2xl mr-3" />
                  <span className="text-gray-700 font-medium">Sign in with Google</span>
                </>
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-6">
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Privacy Policy
              </a>.
            </p>
          </form>

          <div className="text-center mt-4">
            Don&apos;t have an account?
            <Link href="/register">
              <span className="text-blue-500 hover:underline"> Register</span>
            </Link>
          </div>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
