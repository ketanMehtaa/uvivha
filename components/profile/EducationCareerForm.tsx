'use client';

import { useState } from 'react';

interface EducationCareerFormProps {
  user: any;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  setUser: (user: any) => void;
}

export default function EducationCareerForm({
  user,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  setUser,
}: EducationCareerFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    education: user.education || '',
    educationDetails: user.educationDetails || '',
    occupation: user.occupation || '',
    employedIn: user.employedIn || '',
    companyName: user.companyName || '',
    jobTitle: user.jobTitle || '',
    income: user.income || '',
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
    
    if (!formData.education) newErrors.education = 'Education is required';
    if (!formData.occupation) newErrors.occupation = 'Occupation is required';
    if (!formData.employedIn) newErrors.employedIn = 'Employment type is required';
    if (!formData.income) newErrors.income = 'Income is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/profile/education-career', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await res.json();
      
      // Update parent component's user state instead of localStorage
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
      {/* Education Level */}
      <div>
        <label htmlFor="education" className="block text-sm font-medium text-gray-700">
          Highest Education
        </label>
        <select
          id="education"
          name="education"
          value={formData.education}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
        >
          <option value="">Select education level</option>
          <option value="High School">High School</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Bachelor's">Bachelor's Degree</option>
          <option value="Master's">Master's Degree</option>
          <option value="Doctorate">Doctorate</option>
          <option value="Other">Other</option>
        </select>
        {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education}</p>}
      </div>

      {/* Education Details */}
      <div>
        <label htmlFor="educationDetails" className="block text-sm font-medium text-gray-700">
          Education Details
        </label>
        <textarea
          id="educationDetails"
          name="educationDetails"
          value={formData.educationDetails}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Describe your educational background"
        />
      </div>

      {/* Occupation */}
      <div>
        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
          Occupation
        </label>
        <select
          id="occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
        >
          <option value="">Select occupation</option>
          <option value="Private Job">Private Job</option>
          <option value="Government Job">Government Job</option>
          <option value="Business">Business</option>
          <option value="Self Employed">Self Employed</option>
          <option value="Not Working">Not Working</option>
        </select>
        {errors.occupation && <p className="mt-1 text-sm text-red-600">{errors.occupation}</p>}
      </div>

      {/* Employed In */}
      <div>
        <label htmlFor="employedIn" className="block text-sm font-medium text-gray-700">
          Employed In
        </label>
        <select
          id="employedIn"
          name="employedIn"
          value={formData.employedIn}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
        >
          <option value="">Select employment type</option>
          <option value="Private Sector">Private Sector</option>
          <option value="Government/Public Sector">Government/Public Sector</option>
          <option value="Civil Services">Civil Services</option>
          <option value="Defense">Defense</option>
          <option value="Business">Business</option>
          <option value="Not Working">Not Working</option>
        </select>
        {errors.employedIn && <p className="mt-1 text-sm text-red-600">{errors.employedIn}</p>}
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
          Company/Organization Name
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Enter company name"
        />
      </div>

      {/* Job Title */}
      <div>
        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
          Job Title/Designation
        </label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Enter your job title"
        />
      </div>

      {/* Annual Income */}
      <div>
        <label htmlFor="income" className="block text-sm font-medium text-gray-700">
          Annual Income
        </label>
        <select
          id="income"
          name="income"
          value={formData.income}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
        >
          <option value="">Select income range</option>
          <option value="0-3">0-3 LPA</option>
          <option value="3-6">3-6 LPA</option>
          <option value="6-9">6-9 LPA</option>
          <option value="9-12">9-12 LPA</option>
          <option value="12-15">12-15 LPA</option>
          <option value="15+">15+ LPA</option>
        </select>
        {errors.income && <p className="mt-1 text-sm text-red-600">{errors.income}</p>}
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