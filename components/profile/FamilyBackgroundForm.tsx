'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation';
import { handleApiError } from '@/lib/auth';
import { FamilyType } from '@prisma/client';

interface FamilyBackgroundFormProps {
  user: any;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  setUser: (user: any) => void;
}

export default function FamilyBackgroundForm({
  user,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  setUser,
}: FamilyBackgroundFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    familyType: user?.familyType || 'none',
    familyStatus: user?.familyStatus || 'none',
    fatherOccupation: user?.fatherOccupation || '',
    motherOccupation: user?.motherOccupation || '',
    siblings: user?.siblings || '',
    familyLocation: user?.familyLocation || '',
    aboutFamily: user?.aboutFamily || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    
    if (!formData.familyType || formData.familyType === 'none') {
      newErrors.familyType = 'Family type is required';
    }
    if (!formData.familyStatus || formData.familyStatus === 'none') {
      newErrors.familyStatus = 'Family status is required';
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
      familyType: formData.familyType === 'none' ? null : formData.familyType,
      familyStatus: formData.familyStatus === 'none' ? null : formData.familyStatus,
    };

    setLoading(true);
    try {
      const res = await fetch('/api/profile/family', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Family Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Family Type*
        </label>
        <Select
          value={formData.familyType}
          onValueChange={(value) => handleSelectChange('familyType', value)}
        >
           <SelectTrigger>
            <SelectValue placeholder="Select On behalf" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select Family Type</SelectItem>
            {Object.values(FamilyType).map((familyTypeName) => (
              <SelectItem key={familyTypeName} value={familyTypeName}>
                {familyTypeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.familyType && <p className="mt-1 text-sm text-red-600">{errors.familyType}</p>}
      </div>

      {/* Family Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Family Status*
        </label>
        <Select
          value={formData.familyStatus}
          onValueChange={(value) => handleSelectChange('familyStatus', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select family status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select family status</SelectItem>
            <SelectItem value="Middle Class">Middle Class</SelectItem>
            <SelectItem value="Upper Middle Class">Upper Middle Class</SelectItem>
            <SelectItem value="Rich">Rich</SelectItem>
            <SelectItem value="Affluent">Affluent</SelectItem>
          </SelectContent>
        </Select>
        {errors.familyStatus && <p className="mt-1 text-sm text-red-600">{errors.familyStatus}</p>}
      </div>

      {/* Father&apos;s Occupation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Father&apos;s Occupation (Optional)
        </label>
        <Input
          name="fatherOccupation"
          value={formData.fatherOccupation}
          onChange={handleChange}
          placeholder="Enter father's occupation"
        />
      </div>

      {/* Mother&apos;s Occupation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mother&apos;s Occupation (Optional)
        </label>
        <Input
          name="motherOccupation"
          value={formData.motherOccupation}
          onChange={handleChange}
          placeholder="Enter mother's occupation"
        />
      </div>

      {/* Siblings */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Siblings (Optional)
        </label>
        <Input
          name="siblings"
          value={formData.siblings}
          onChange={handleChange}
          placeholder="2 brother(1 married, 1 unmarried) , 1 sister(married)"
        />
      </div>

      {/* Family Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Family Location (Optional)
        </label>
        <Input
          name="familyLocation"
          value={formData.familyLocation}
          onChange={handleChange}
          placeholder="Enter family's location"
        />
        {errors.familyLocation && <p className="mt-1 text-sm text-red-600">{errors.familyLocation}</p>}
      </div>

      {/* About Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About Family (Optional)
        </label>
        <Textarea
          name="aboutFamily"
          value={formData.aboutFamily}
          onChange={handleChange}
          rows={3}
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