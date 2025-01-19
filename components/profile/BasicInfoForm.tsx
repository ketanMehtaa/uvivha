'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import castes from '@/data/castes.json';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormShimmer } from "@/components/ui/shimmer";
import { handleApiError } from '@/lib/auth';
import ImageUpload from './ImageUpload';

// Type for castes data
type CastesData = {
  [key: string]: {
    subcastes: string[];
  };
};

interface BasicInfoFormProps {
  user: any;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  setUser: (user: any) => void;
}

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  return errors;
};

export default function BasicInfoForm({
  user,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  setUser,
}: BasicInfoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    email: '',
    gender: '',
    birthDate: '',
    location: '',
    bio: '',
    caste: '',
    subcaste: '',
    images: [] as string[],
  });

  // Fetch user data when component mounts
  useEffect(() => {
    let isMounted = true;

    // If we already have user data from props, use that instead of fetching
    if (user?.name) {
      const formattedDate = user.birthDate 
        ? new Date(user.birthDate).toISOString().split('T')[0]
        : '';

      setFormData({
        name: user.name || '',
        password: user.password || '',
        email: user.email || '',
        gender: user.gender || '',
        birthDate: formattedDate,
        location: user.location || '',
        bio: user.bio || '',
        caste: user.caste || '',
        subcaste: user.subcaste || '',
        images: user.photos || [],
      });
      setFetchingData(false);
      return;
    }

    const fetchUserData = async () => {
      if (!isMounted) return;
      
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();

        if (!isMounted) return;

        if (data.error) {
          console.error('Error fetching user data:', data.error);
          return;
        }

        if (data.user) {
          const formattedDate = data.user.birthDate 
            ? new Date(data.user.birthDate).toISOString().split('T')[0]
            : '';

          setFormData({
            name: data.user.name || '',
            password: data.user.password || '',
            email: data.user.email || '',
            gender: data.user.gender || '',
            birthDate: formattedDate,
            location: data.user.location || '',
            bio: data.user.bio || '',
            caste: data.user.caste || '',
            subcaste: data.user.subcaste || '',
            images: data.user.photos || [],
          });
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching user data:', error);
      } finally {
        if (isMounted) {
          setFetchingData(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [user]); // Added user to dependency array to refetch when user prop changes

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear previous errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Only clear subcaste when caste changes and it's a different value
    if (name === 'caste' && value !== formData.caste) {
      setFormData(prev => ({ ...prev, subcaste: '' }));
    }
  };

  const handleImagesChange = (newImages: string[]) => {
    setFormData(prev => ({ ...prev, images: newImages }));
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.gender || formData.gender === 'none') newErrors.gender = 'Gender is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.caste || formData.caste === 'none') newErrors.caste = 'Caste is required';
    if (formData.images.length < 2) newErrors.images = 'At least 2 images are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        photos: formData.images,
      };

      const res = await fetch('/api/profile/basic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      const data = await res.json();
      setUser({ ...user, ...data.user });
      onNext();
    } catch (error) {
      handleApiError(error, router);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return <FormShimmer />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Enter your full name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Enter your password"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Enter your email"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <Select
          value={formData.gender}
          onValueChange={(value) => handleSelectChange('gender', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select gender</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
      </div>

      {/* Birth Date */}
      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
          Birth Date
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
        />
        {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Enter your location"
        />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Tell us about yourself"
        />
      </div>

      {/* Caste */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Caste
        </label>
        <Select
          value={formData.caste}
          onValueChange={(value) => handleSelectChange('caste', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select caste" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select caste</SelectItem>
            {Object.keys(castes as CastesData).map((casteName) => (
              <SelectItem key={casteName} value={casteName}>
                {casteName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.caste && <p className="mt-1 text-sm text-red-600">{errors.caste}</p>}
      </div>

      {/* Subcaste */}
      {formData.caste && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcaste
          </label>
          <Select
            value={formData.subcaste}
            onValueChange={(value) => handleSelectChange('subcaste', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcaste" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select subcaste</SelectItem>
              {(castes as CastesData)[formData.caste]?.subcastes.map((subcaste) => (
                <SelectItem key={subcaste} value={subcaste}>
                  {subcaste}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Profile Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Images
        </label>
        <ImageUpload
          images={formData.images}
          onImagesChange={handleImagesChange}
          className="mb-2"
        />
        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-between pt-4">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Previous
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 ${
            isFirstStep ? 'ml-auto' : ''
          }`}
        >
          {loading ? 'Saving...' : isLastStep ? 'Finish' : 'Next'}
        </button>
      </div>
    </form>
  );
} 