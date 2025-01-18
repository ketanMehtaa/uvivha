import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  education: string;
  occupation: string;
  photos: string[];
  height: number;
  maritalStatus: string;
  religion: string;
  caste: string;
}

export default function ProfilesList() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/api/profiles');
        const data = await res.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        if (data.profiles) {
          setProfiles(data.profiles);
        }
      } catch (error) {
        setError('Failed to fetch profiles');
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No profiles found matching your preferences.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <div key={profile.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-48 w-full">
            {profile.photos && profile.photos.length > 0 ? (
              <Image
                src={profile.photos[0]}
                alt={`${profile.name}'s photo`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{profile.name}</h3>
              <span className="text-sm text-gray-500">{profile.age} yrs</span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p>📍 {profile.location}</p>
              <p>📚 {profile.education}</p>
              <p>💼 {profile.occupation}</p>
              <p>📏 {profile.height} cm</p>
              <p>💑 {profile.maritalStatus}</p>
              <p>🕉️ {profile.religion} • {profile.caste}</p>
            </div>

            <button className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 