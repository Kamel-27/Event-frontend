import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../api';

const DebugAuth = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const testAuth = async () => {
    try {
      console.log('Testing authentication...');
      const response = await getProfile();
      console.log('Profile response:', response);
      alert('Authentication working! Check console for details.');
    } catch (error) {
      console.error('Auth test error:', error);
      alert('Authentication failed! Check console for details.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Authentication Debug</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
      </div>

      <button
        onClick={testAuth}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Authentication
      </button>
    </div>
  );
};

export default DebugAuth;
