import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import axios from 'axios';

interface LoginCredentials {
  username: string;
  password: string;
}

function Login() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Debug: Log credentials before sending the request
    console.log('Submitting credentials:', credentials);

    try {
      // Log the API endpoint and request payload
      console.log('Sending request to /api/token with payload:', credentials);

      const response = await axios.post(
          'http://localhost:3000/api/token',
          credentials, // Send the credentials as JSON
          {
            headers: {
              'Content-Type': 'application/json', // Set Content-Type to application/json
            }
          }
      );

      // Log the full response for debugging
      console.log('Response from server:', response);

      // Check if the response contains a token
      if (response.data && response.data.token) {
        // Store the token in a cookie with HttpOnly flag
        document.cookie = `auth_token=${response.data.token}; path=/; max-age=86400; secure; samesite=strict`;

        // Redirect to dashboard after successful login
        window.location.href = '/dashboard';
      } else {
        console.error('No token found in response:', response);
        setError('Invalid credentials or server issue');
      }
    } catch (err) {
      // Log error details for debugging
      console.error('Error during request:', err);

      if (axios.isAxiosError(err)) {
        // If it's an Axios error, log the response data
        console.error('Axios error response:', err.response);
        setError(err.response?.data?.message || 'Invalid credentials');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    name="username" // Correct field name for username
                    value={credentials.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your username"
                    required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    required
                />
              </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
  );
}

export default Login;
