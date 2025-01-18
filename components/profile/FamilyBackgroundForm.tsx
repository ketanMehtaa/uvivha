'use client';

import { useState } from 'react';

interface FamilyBackgroundFormProps {
  user: any;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function FamilyBackgroundForm({
  user,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
}: FamilyBackgroundFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    familyType: user.familyType || '',
    familyStatus: user.familyStatus || '',
    fatherOccupation: user.fatherOccupation || '',
    motherOccupation: user.motherOccupation || '',
    siblings: user.siblings || '',
    familyLocation: user.familyLocation || '',
    aboutFamily: user.aboutFamily || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.familyType) newErrors.familyType = 'Family type is required';
    if (!formData.familyStatus) newErrors.familyStatus = 'Family status is required';
    if (!formData.familyLocation) newErrors.familyLocation = 'Family location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/profile/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const data = await res.json();
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...userData, ...data.user }));
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
      {/* Family Type */}
      <div>
        <label htmlFor="familyType" className="block text-sm font-medium text-gray-700">
          Family Type
        </label>
        <select
          id="familyType"
          name="familyType"
          value={formData.familyType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
        >
          <option value="">Select family type</option>
          <option value="Joint Family">Joint Family</option>
          <option value="Nuclear Family">Nuclear Family</option>
        </select>
        {errors.familyType && <p className="mt-1 text-sm text-red-600">{errors.familyType}</p>}
      </div>

      {/* Family Status */}
      <div>
        <label htmlFor="familyStatus" className="block text-sm font-medium text-gray-700">
          Family Status
        </label>
        <select
          id="familyStatus"
          name="familyStatus"
          value={formData.familyStatus}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
        >
          <option value="">Select family status</option>
          <option value="Middle Class">Middle Class</option>
          <option value="Upper Middle Class">Upper Middle Class</option>
          <option value="Rich">Rich</option>
          <option value="Affluent">Affluent</option>
        </select>
        {errors.familyStatus && <p className="mt-1 text-sm text-red-600">{errors.familyStatus}</p>}
      </div>

      {/* Father's Occupation */}
      <div>
        <label htmlFor="fatherOccupation" className="block text-sm font-medium text-gray-700">
          Father's Occupation
        </label>
        <input
          type="text"
          id="fatherOccupation"
          name="fatherOccupation"
          value={formData.fatherOccupation}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Enter father's occupation"
        />
      </div>

      {/* Mother's Occupation */}
      <div>
        <label htmlFor="motherOccupation" className="block text-sm font-medium text-gray-700">
          Mother's Occupation
        </label>
        <input
          type="text"
          id="motherOccupation"
          name="motherOccupation"
          value={formData.motherOccupation}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Enter mother's occupation"
        />
      </div>

      {/* Siblings */}
      <div>
        <label htmlFor="siblings" className="block text-sm font-medium text-gray-700">
          Siblings
        </label>
        <input
          type="text"
          id="siblings"
          name="siblings"
          value={formData.siblings}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Number and details of siblings"
        />
      </div>

      {/* Family Location */}
      <div>
        <label htmlFor="familyLocation" className="block text-sm font-medium text-gray-700">
          Family Location
        </label>
        <input
          type="text"
          id="familyLocation"
          name="familyLocation"
          value={formData.familyLocation}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Enter family's location"
        />
        {errors.familyLocation && <p className="mt-1 text-sm text-red-600">{errors.familyLocation}</p>}
      </div>

      {/* About Family */}
      <div>
        <label htmlFor="aboutFamily" className="block text-sm font-medium text-gray-700">
          About Family
        </label>
        <textarea
          id="aboutFamily"
          name="aboutFamily"
          value={formData.aboutFamily}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Tell us about your family"
        />
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
          {loading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </form>
  );
} 