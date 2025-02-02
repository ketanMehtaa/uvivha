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
    education: user?.education || 'none',
    educationDetails: user?.educationDetails || '',
    occupation: user?.occupation || 'none',
    companyName: user?.companyName || '',
    jobTitle: user?.jobTitle || '',
    income: user?.income || 'none',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

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
    
    if (!formData.education || formData.education === 'none') {
      newErrors.education = 'Education is required';
    }
    if (!formData.occupation || formData.occupation === 'none') {
      newErrors.occupation = 'Occupation is required';
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
      education: formData.education === 'none' ? null : formData.education,
      occupation: formData.occupation === 'none' ? null : formData.occupation,
      income: formData.income === 'none' ? null : formData.income,
    };

    setLoading(true);
    try {
      const res = await fetch('/api/profile/education-career', {
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
      setUser(data.user);
      onNext();
    } catch (error) {
      handleApiError(error, router);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Education Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Highest Education*
        </label>
        <Select
          value={formData.education}
          onValueChange={(value) => handleSelectChange('education', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select education level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select education level</SelectItem>
            <SelectItem value="High School">High School</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Bachelor's">Bachelor&apos;s Degree</SelectItem>
            <SelectItem value="Master's">Master&apos;s Degree</SelectItem>
            <SelectItem value="Doctorate">Doctorate</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education}</p>}
      </div>

      {/* Education Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Education Details
        </label>
        <Textarea
          required
          name="educationDetails"
          value={formData.educationDetails}
          onChange={handleChange}
          rows={3}
          placeholder="Describe your educational background"
        />
      </div>

      {/* Occupation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Occupation*
        </label>
        <Select
          value={formData.occupation}
          onValueChange={(value) => handleSelectChange('occupation', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select occupation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select occupation</SelectItem>
            <SelectItem value="Private Sector">Private Sector</SelectItem>
            <SelectItem value="Government/Public Sector">Government/Public Sector</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Self Employed">Self Employed</SelectItem>
            <SelectItem value="Civil Services">Civil Services</SelectItem>
            <SelectItem value="Defense">Defense</SelectItem>
            <SelectItem value="Not Working">Not Working</SelectItem>
            <SelectItem value="Student">Student</SelectItem>
          </SelectContent>
        </Select>
        {errors.occupation && <p className="mt-1 text-sm text-red-600">{errors.occupation}</p>}
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company/Organization Name (Optional)
        </label>
        <Input
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter company name"
        />
      </div>

      {/* Job Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Title/Designation (Optional)
        </label>
        <Input
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          placeholder="Enter your job title"
        />
      </div>

      {/* Annual Income */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Annual Income (Optional)
        </label>
        <Select
          value={formData.income}
          onValueChange={(value) => handleSelectChange('income', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select income range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select income range</SelectItem>
            <SelectItem value="0-2">0-2 LPA</SelectItem>
            <SelectItem value="2-4">2-4 LPA</SelectItem>
            <SelectItem value="4-6">4-6 LPA</SelectItem>
            <SelectItem value="6-8">6-8 LPA</SelectItem>
            <SelectItem value="8-10">8-10 LPA</SelectItem>
            <SelectItem value="10-15">10-15 LPA</SelectItem>
            <SelectItem value="15-20">15-20 LPA</SelectItem>
            <SelectItem value="20-25">20-25 LPA</SelectItem>
            <SelectItem value="25-30">25-30 LPA</SelectItem>
            <SelectItem value="30-50">30-50 LPA</SelectItem>
            <SelectItem value="50-100">50-100 LPA</SelectItem>
            <SelectItem value="100">100+ LPA</SelectItem>

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