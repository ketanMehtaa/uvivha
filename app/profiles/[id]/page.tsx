'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, MapPin, Briefcase, GraduationCap, Phone, Calendar, Users, ChevronLeft } from 'lucide-react';

export interface Profile {
    id: string;
    created_by: string | null;
    name: string | null;
    mobile1: string | null;
    mobile2: string | null;
    gender: 'Male' | 'Female' | null;
    birth_date: string | null;
    location: string | null;
    district: string | null;
    height: number | null;
    weight: number | null;
    complexion: 'Fair' | 'Wheatish' | 'Dark' | null;
    education: string | null;
    occupation: string | null;
    company_name: string | null;
    job_title: string | null;
    income: number | null;
    marital_status: 'Unmarried' | 'Married' | 'Divorced' | 'Widowed' | null;
    community: 'Kumaoni' | 'Garhwali' | 'Jaunsari' | null;
    caste: 'Rajput' | 'Brahmin' | 'Others' | null;
    father_occupation: string | null;
    mother_occupation: string | null;
    siblings: string | null;
    family_location: string | null;
    gotra: string | null;
    manglik: 'Yes' | 'No' | null;
    bio: string | null;
    is_profile_complete: boolean | null;
    source_group: string | null;
    message_date: string | null;
    message_timestamp: string | null;
    created_at: string | null;
    updated_at: string | null;
}

const supabase = createClient(
    "https://bypmosswagodohkfndfy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5cG1vc3N3YWdvZG9oa2ZuZGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NTkyNDgsImV4cCI6MjA3MTAzNTI0OH0.6h8NMVs1aZ_OuvogShCUygG8Mh2k687Y6cXluRGaWQY"
);

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const profileId = params.id as string;

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profileId) {
            fetchProfile(profileId);
        }
    }, [profileId]);

    const fetchProfile = async (id: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (!error && data) {
            setProfile(data);
        }
        setLoading(false);
    };

    const calculateAge = (birthDate: string) => {
        return new Date().getFullYear() - new Date(birthDate).getFullYear();
    };

    const shareProfile = (profileId: string, name: string) => {
        const url = `${window.location.origin}/profiles/${profileId}`;
        const text = `Check out ${name}'s profile: ${url}`;

        if (navigator.share) {
            navigator.share({ title: `${name}'s Profile`, text, url });
        } else {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <p className="text-lg">Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg mb-4">Profile not found</p>
                    <Button onClick={() => router.push('/profiles')}>
                        Back to Profiles
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <Card className="max-w-4xl mx-auto">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="font-bold text-3xl mb-2">{profile.name}</h1>
                            <p className="text-lg text-gray-600">
                                {profile.birth_date && `${calculateAge(profile.birth_date)} years`}
                                {profile.gender && ` • ${profile.gender}`}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => shareProfile(profile.id, profile.name ?? 'Profile')}
                            >
                                <Share2 className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/profiles')}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-3 mb-6">
                        {profile.location && (
                            <div className="flex items-center text-gray-700">
                                <MapPin className="w-5 h-5 mr-2" />
                                {profile.location}
                            </div>
                        )}
                        {profile.occupation && (
                            <div className="flex items-center text-gray-700">
                                <Briefcase className="w-5 h-5 mr-2" />
                                {profile.occupation}
                                {profile.company_name && ` at ${profile.company_name}`}
                            </div>
                        )}
                        {profile.education && (
                            <div className="flex items-center text-gray-700">
                                <GraduationCap className="w-5 h-5 mr-2" />
                                {profile.education}
                            </div>
                        )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {profile.community && <Badge variant="secondary">{profile.community}</Badge>}
                        {profile.caste && <Badge variant="outline">{profile.caste}</Badge>}
                        {profile.height && <Badge variant="outline">{profile.height}cm</Badge>}
                        {profile.weight && <Badge variant="outline">{profile.weight}kg</Badge>}
                        {profile.income && <Badge variant="outline">₹{profile.income}L</Badge>}
                        {profile.marital_status && <Badge variant="outline">{profile.marital_status}</Badge>}
                    </div>

                    {/* Contact Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <Phone className="w-5 h-5 mr-2" />
                            Contact Information
                        </h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            {profile.mobile1 && <p className="mb-2"><strong>Primary:</strong> {profile.mobile1}</p>}
                            {profile.mobile2 && <p><strong>Secondary:</strong> {profile.mobile2}</p>}
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            Personal Details
                        </h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.birth_date && (
                                    <p><strong>Date of Birth:</strong> {new Date(profile.birth_date).toLocaleDateString()}</p>
                                )}
                                {profile.complexion && (
                                    <p><strong>Complexion:</strong> {profile.complexion}</p>
                                )}
                                {profile.district && (
                                    <p><strong>District:</strong> {profile.district}</p>
                                )}
                                {profile.job_title && (
                                    <p><strong>Job Title:</strong> {profile.job_title}</p>
                                )}
                                {profile.manglik && (
                                    <p><strong>Manglik:</strong> {profile.manglik}</p>
                                )}
                                {profile.gotra && (
                                    <p><strong>Gotra:</strong> {profile.gotra}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Family Details */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Family Details
                        </h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.father_occupation && (
                                    <p><strong>Father's Occupation:</strong> {profile.father_occupation}</p>
                                )}
                                {profile.mother_occupation && (
                                    <p><strong>Mother's Occupation:</strong> {profile.mother_occupation}</p>
                                )}
                                {profile.family_location && (
                                    <p><strong>Family Location:</strong> {profile.family_location}</p>
                                )}
                                {profile.siblings && (
                                    <p><strong>Siblings:</strong> {profile.siblings}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">About</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                            </div>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="text-center">
                        <Button onClick={() => router.push('/profiles')} size="lg">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back to All Profiles
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
