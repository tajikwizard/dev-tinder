import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/signup', {
        firstName,
        email,
        password,
      });
      console.log('Registered successful:', response.data);
      // Handle success (e.g., save token, redirect)
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-96 p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* First Name Input */}
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 mb-4 focus-within:border-indigo-500 focus-within:ring focus-within:ring-indigo-200">
          <svg
            className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
          </svg>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="flex-grow outline-none text-gray-700"
          />
        </div>

        {/* Email Input */}
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 mb-4 focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-200">
          <svg
            className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM16 12V13.5C16 14.8807 17.1193 16 18.5 16C19.8807 16 21 14.8807 21 13.5V12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21H16"></path>
          </svg>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-grow outline-none text-gray-700"
          />
        </div>

        {/* Password Input */}
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 mb-6 focus-within:border-purple-500 focus-within:ring focus-within:ring-purple-200">
          <svg
            className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13.6667 8.99988L12 11.9999M12 11.9999L10.3333 8.99988M12 11.9999H9.5M12 11.9999H14.5M12 11.9999L10.3333 14.9999M12 11.9999L13.6667 14.9999M6.16667 8.99994L4.5 11.9999M4.5 11.9999L2.83333 8.99994M4.5 11.9999H2M4.5 11.9999H7M4.5 11.9999L2.83333 14.9999M4.5 11.9999L6.16667 14.9999M21.1667 8.99994L19.5 11.9999M19.5 11.9999L17.8333 8.99994M19.5 11.9999H17M19.5 11.9999H22M19.5 11.9999L17.8333 14.9999M19.5 11.9999L21.1667 14.9999"></path>
          </svg>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="flex-grow outline-none text-gray-700"
          />
        </div>

        {/* Register Button */}
        <div className="text-center">
          <button
            onClick={handleRegister}
            className="bg-green-600 text-white w-full py-2 rounded-md font-medium transition-transform duration-200 hover:scale-95 hover:bg-green-700"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
