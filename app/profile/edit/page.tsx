'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BasicInfoForm from '@/components/profile/BasicInfoForm';
import PhysicalInfoForm from '@/components/profile/PhysicalInfoForm';
import EducationCareerForm from '@/components/profile/EducationCareerForm';
import FamilyBackgroundForm from '@/components/profile/FamilyBackgroundForm';
import PreferencesForm from '@/components/profile/PreferencesForm';

type Step = 'basic' | 'physical' | 'education' | 'family' | 'preferences';

export default function ProfileEditPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if authenticated
        const authRes = await fetch('/api/auth/check');
        const authData = await authRes.json();
        
        if (!authData.authenticated) {
          router.push('/auth');
          return;
        }

        // Then fetch user data
        const res = await fetch('/api/user/me');
        const data = await res.json();

        if (data.error) {
          console.error('Error fetching user data:', data.error);
          router.push('/auth');
          return;
        }

        if (data.user) {
          setUser(data.user);
        } else {
          router.push('/auth');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const steps: Step[] = ['basic', 'physical', 'education', 'family', 'preferences'];
  
  const stepComponents = {
    basic: BasicInfoForm,
    physical: PhysicalInfoForm,
    education: EducationCareerForm,
    family: FamilyBackgroundForm,
    preferences: PreferencesForm,
  };

  const stepTitles = {
    basic: 'Basic Information',
    physical: 'Physical Attributes',
    education: 'Education & Career',
    family: 'Family Background',
    preferences: 'Partner Preferences',
  };

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      // If it's the last step, redirect to dashboard
      router.push('/dashboard');
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth');
    return null;
  }

  const CurrentStepComponent = stepComponents[currentStep];
  const progress = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-red-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {steps.indexOf(currentStep) + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {progress}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-red-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Step title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {stepTitles[currentStep]}
          </h1>

          {/* Form component */}
          <CurrentStepComponent
            user={user}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={currentStep === steps[0]}
            isLastStep={currentStep === steps[steps.length - 1]}
            setUser={setUser}
          />
        </div>
      </div>
    </div>
  );
} 