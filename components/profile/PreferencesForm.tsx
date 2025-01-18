'use client';

import { useState } from 'react';
import castes from '@/data/castes.json';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Type for castes data
type CastesData = {
  [key: string]: {
    subcastes: string[];
  };
};

interface PreferencesFormProps {
  user: any;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  setUser: (user: any) => void;
}

export default function PreferencesForm({
  user,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  setUser,
}: PreferencesFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    agePreferenceMin: user.agePreferenceMin || '',
    agePreferenceMax: user.agePreferenceMax || '',
    heightPreferenceMin: user.heightPreferenceMin || '',
    heightPreferenceMax: user.heightPreferenceMax || '',
    maritalStatusPreference: user.maritalStatusPreference || '',
    educationPreference: user.educationPreference || '',
    occupationPreference: user.occupationPreference || '',
    locationPreference: user.locationPreference || '',
    castePreference: user.castePreference || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.agePreferenceMin) newErrors.agePreferenceMin = 'Minimum age is required';
    if (!formData.agePreferenceMax) newErrors.agePreferenceMax = 'Maximum age is required';
    if (!formData.heightPreferenceMin) newErrors.heightPreferenceMin = 'Minimum height is required';
    if (!formData.heightPreferenceMax) newErrors.heightPreferenceMax = 'Maximum height is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/profile/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const data = await res.json();
      setUser({ ...user, ...data.user });
      onNext();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Age Preference */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="agePreferenceMin" className="block text-sm font-medium text-gray-700">
            Minimum Age
          </label>
          <input
            type="number"
            id="agePreferenceMin"
            name="agePreferenceMin"
            value={formData.agePreferenceMin}
            onChange={handleChange}
            min="18"
            max="70"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          />
          {errors.agePreferenceMin && <p className="mt-1 text-sm text-red-600">{errors.agePreferenceMin}</p>}
        </div>
        <div>
          <label htmlFor="agePreferenceMax" className="block text-sm font-medium text-gray-700">
            Maximum Age
          </label>
          <input
            type="number"
            id="agePreferenceMax"
            name="agePreferenceMax"
            value={formData.agePreferenceMax}
            onChange={handleChange}
            min="18"
            max="70"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          />
          {errors.agePreferenceMax && <p className="mt-1 text-sm text-red-600">{errors.agePreferenceMax}</p>}
        </div>
      </div>

      {/* Height Preference */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="heightPreferenceMin" className="block text-sm font-medium text-gray-700">
            Minimum Height (cm)
          </label>
          <input
            type="number"
            id="heightPreferenceMin"
            name="heightPreferenceMin"
            value={formData.heightPreferenceMin}
            onChange={handleChange}
            min="120"
            max="220"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          />
          {errors.heightPreferenceMin && <p className="mt-1 text-sm text-red-600">{errors.heightPreferenceMin}</p>}
        </div>
        <div>
          <label htmlFor="heightPreferenceMax" className="block text-sm font-medium text-gray-700">
            Maximum Height (cm)
          </label>
          <input
            type="number"
            id="heightPreferenceMax"
            name="heightPreferenceMax"
            value={formData.heightPreferenceMax}
            onChange={handleChange}
            min="120"
            max="220"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          />
          {errors.heightPreferenceMax && <p className="mt-1 text-sm text-red-600">{errors.heightPreferenceMax}</p>}
        </div>
      </div>

      {/* Marital Status Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Marital Status Preference
        </label>
        <Select
          value={formData.maritalStatusPreference}
          onValueChange={(value) => handleSelectChange('maritalStatusPreference', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select marital status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select marital status</SelectItem>
            <SelectItem value="Never Married">Never Married</SelectItem>
            <SelectItem value="Divorced">Divorced</SelectItem>
            <SelectItem value="Widowed">Widowed</SelectItem>
            <SelectItem value="Any">Any</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Education Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Education Preference
        </label>
        <Select
          value={formData.educationPreference}
          onValueChange={(value) => handleSelectChange('educationPreference', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select education preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select education preference</SelectItem>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Bachelor's and above">Bachelor's and above</SelectItem>
            <SelectItem value="Master's and above">Master's and above</SelectItem>
            <SelectItem value="Doctorate">Doctorate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Occupation Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Occupation Preference
        </label>
        <Select
          value={formData.occupationPreference}
          onValueChange={(value) => handleSelectChange('occupationPreference', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select occupation preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select occupation preference</SelectItem>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Private Job">Private Job</SelectItem>
            <SelectItem value="Government Job">Government Job</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Self Employed">Self Employed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location Preference */}
      <div>
        <label htmlFor="locationPreference" className="block text-sm font-medium text-gray-700">
          Location Preference
        </label>
        <input
          type="text"
          id="locationPreference"
          name="locationPreference"
          value={formData.locationPreference}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Enter preferred location"
        />
      </div>

      {/* Caste Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Caste Preference
        </label>
        <Select
          value={formData.castePreference}
          onValueChange={(value) => handleSelectChange('castePreference', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select caste preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select caste preference</SelectItem>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Same as mine">Same as mine</SelectItem>
            {Object.keys(castes as CastesData).map((casteName) => (
              <SelectItem key={casteName} value={casteName}>
                {casteName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Form Actions */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstStep || loading}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={loading}
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isLastStep ? 'Finish' : 'Next'}
        </button>
      </div>
    </form>
  );
} 