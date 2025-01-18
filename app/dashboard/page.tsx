'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  gender?: string;
  birthDate?: string;
  location?: string;
  bio?: string;
  height?: number;
  education?: string;
  occupation?: string;
  income?: string;
  maritalStatus?: string;
  religion?: string;
  caste?: string;
  motherTongue?: string;
  photos?: string[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    console.log('Dashboard: Loading user data from localStorage:', userData);
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('Dashboard: Parsed user data:', parsedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-pink-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Session Expired</h1>
          <p className="text-gray-600 mb-6">Please log in again to continue.</p>
          <Link 
            href="/auth" 
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Calculate profile completion percentage
  const requiredFields: (keyof UserProfile)[] = [
    'name', 'mobile', 'email', 'gender', 'birthDate', 'location',
    'bio', 'height', 'education', 'occupation', 'income',
    'maritalStatus', 'religion', 'caste', 'motherTongue'
  ];
  
  const completedFields = requiredFields.filter(field => user[field] !== null && user[field] !== undefined);
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);
  const isProfileComplete = completionPercentage === 100;

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome, {user.name}! 👋
          </h1>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Profile Completion</span>
              <span className="text-sm font-semibold text-gray-700">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-red-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {!isProfileComplete ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                Complete Your Profile
              </h2>
              <p className="text-yellow-700 mb-4">
                Your profile is {completionPercentage}% complete. Complete your profile to increase your chances of finding the perfect match!
              </p>
              <Link 
                href="/profile/edit" 
                className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Complete Profile
              </Link>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Profile Complete! 🎉
              </h2>
              <p className="text-green-700">
                Your profile is complete and ready to be discovered by potential matches.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 