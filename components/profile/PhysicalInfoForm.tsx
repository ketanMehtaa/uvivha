'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PhysicalInfoFormProps {
  user: any;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  setUser: (user: any) => void;
}
const complexionMapping = {
  NONE: 'Select complexion',
  VERY_FAIR: 'Very Fair',
  FAIR: 'Fair',
  WHEATISH: 'Wheatish',
  DARK: 'Dark'
}
export default function PhysicalInfoForm({
  user,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  setUser,
}: PhysicalInfoFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    height: user?.height?.toString() || '',
    weight: user?.weight?.toString() || '',
    complexion: user?.complexion || 'none',
    physicalStatus: user?.physicalStatus || 'none',
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
    
    // Height validation
    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else {
      const heightNum = Number(formData.height);
      if (isNaN(heightNum) || heightNum < 3 || heightNum > 8) {
        newErrors.height = 'Height must be between 3ft and 8ft';
      }
    }

    // Weight validation (optional)
    if (formData.weight) {
      const weightNum = Number(formData.weight);
      if (isNaN(weightNum) || weightNum < 30 || weightNum > 200) {
        newErrors.weight = 'Weight must be between 30kg and 200kg';
      }
    }


    // Physical Status validation
    if (!formData.physicalStatus || formData.physicalStatus === 'none') {
      newErrors.physicalStatus = 'Physical status is required';
    }

    // Complexion validation
    if (!formData.complexion || formData.complexion === 'NONE') {
      newErrors.complexion = 'Complexion is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Clean up the data before sending
    const dataToSend = {
      ...formData,
      complexion: formData.complexion === 'NONE' ? null : formData.complexion,
      physicalStatus: formData.physicalStatus === 'none' ? null : formData.physicalStatus,
    };

    setLoading(true);
    try {
      const res = await fetch('/api/profile/physical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      const data = await res.json();
      setUser(data.user);
      onNext();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Height */}
      <div>
        <label htmlFor="height" className="block text-sm font-medium text-gray-700">
          Height (in f)
        </label>
        <input
          type="number"
          id="height"
          name="height"
          value={formData.height}

          onChange={handleChange}
          step="0.01"  
          min="3"
          max="8"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Enter height in ft"
        />
        {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
      </div>

      {/* Weight */}
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
          Weight (in kg)
        </label>
        <input
          type="number"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          min="30"
          max="200"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
          placeholder="Enter weight in kilograms"
        />
        {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
      </div>

      {/* Complexion */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Complexion
        </label>
        <Select
          value={formData.complexion}
          onValueChange={(value) => handleSelectChange('complexion', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select complexion" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="none">Select complexion</SelectItem>
            <SelectItem value="Very Fair">Very Fair</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
            <SelectItem value="Wheatish">Wheatish</SelectItem>
            <SelectItem value="Dark">Dark</SelectItem> */}
            {Object.entries(complexionMapping).map(([key, value]) => (
              <SelectItem key={key} value={key}>{value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.complexion && <p className="mt-1 text-sm text-red-600">{errors.complexion}</p>}
      </div>

      {/* Physical Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Physical Status
        </label>
        <Select
          value={formData.physicalStatus}
          onValueChange={(value) => handleSelectChange('physicalStatus', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select physical status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select physical status</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="Physically Challenged">Physically Challenged</SelectItem>
          </SelectContent>
        </Select>
        {errors.physicalStatus && <p className="mt-1 text-sm text-red-600">{errors.physicalStatus}</p>}
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
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : isLastStep ? 'Finish' : 'Next'}
        </button>
      </div>
    </form>
  );
} 