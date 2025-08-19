'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Share2,
    MapPin,
    Briefcase,
    GraduationCap,
    Phone,
    Calendar,
    Users,
    ChevronLeft,
    Heart,
    MessageCircle,
    Mail,
    User,
    Home,
    Cake,
    Scale,
    IndianRupee,
    BookOpen,
    Shield
} from 'lucide-react';

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
    const [activeTab, setActiveTab] = useState('overview');
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (profileId) {
            fetchProfile(profileId);
        }
    }, [profileId]);

    const fetchProfile = async (id: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                setProfile(data);
            } else {
                console.error('Error fetching profile:', error);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const shareProfile = (profileId: string, name: string) => {
        const url = `${window.location.origin}/profiles/${profileId}`;
        const text = `Check out ${name}'s profile on Kumaoni Matrimony: ${url}`;

        if (navigator.share) {
            navigator.share({ title: `${name}'s Profile`, text, url });
        } else {
            // Fallback for desktop - copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                alert('Profile link copied to clipboard!');
            });
        }
    };

    const handleContact = (type: 'call' | 'message' | 'whatsapp') => {
        if (!profile) return;

        const number = profile.mobile1 || profile.mobile2;
        if (!number) {
            alert('No contact number available');
            return;
        }

        switch (type) {
            case 'call':
                window.open(`tel:${number}`, '_self');
                break;
            case 'message':
                window.open(`sms:${number}`, '_self');
                break;
            case 'whatsapp':
                const profileLink = `${window.location.origin}/profiles/${profile.id}`;
                const message = encodeURIComponent(
                    `Hello${profile.name ? ` ${profile.name}` : ''}! I found your profile on hamy.in : ${profileLink}\n\nCould you please share your photos and bio data?`
                );
                window.open(`https://wa.me/${number}?text=${message}`, '_blank');
                break;
        }
    };

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                        <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
                    <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist or may have been removed.</p>
                    <Button onClick={() => router.push('/profiles')} className="w-full sm:w-auto">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back to Profiles
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header with back button and actions */}
            <div className="sticky top-0 z-10 bg-white border-b shadow-sm p-4 flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/profiles')}
                    className="rounded-full"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <h1 className="font-semibold text-lg">Profile Details</h1>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => shareProfile(profile.id, profile.name ?? 'Profile')}
                    className="rounded-full"
                >
                    <Share2 className="w-5 h-5" />
                </Button>
            </div>

            {/* Profile Header */}
            <div className="p-4 bg-gradient-to-b from-white to-gray-50">
                <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {profile.gender && (
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs ${profile.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                                } text-white`}>
                                {profile.gender === 'Male' ? 'M' : 'F'}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h1 className="font-bold text-2xl mb-1 truncate">{profile.name || 'Name not provided'}</h1>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                            {profile.birth_date && (
                                <span className="flex items-center text-sm">
                                    <Cake className="w-4 h-4 mr-1" />
                                    {calculateAge(profile.birth_date)} years
                                </span>
                            )}
                            {profile.height && (
                                <span className="flex items-center text-sm">
                                    <Scale className="w-4 h-4 mr-1" />
                                    {profile.height} cm
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {profile.community && <Badge variant="secondary">{profile.community}</Badge>}
                            {profile.caste && <Badge variant="outline">{profile.caste}</Badge>}
                            {profile.marital_status && <Badge variant="outline">{profile.marital_status}</Badge>}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mb-4">
                    <Button
                        className="flex-1"
                        size="sm"
                        onClick={() => handleContact('call')}
                        disabled={!profile.mobile1 && !profile.mobile2}
                    >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                    </Button>
                    <Button
                        className="flex-1"
                        size="sm"
                        variant="outline"
                        onClick={() => handleContact('whatsapp')}
                        disabled={!profile.mobile1 && !profile.mobile2}
                    >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        className="shrink-0"
                    >
                        <Heart className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
                <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="family">Family</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Location & Occupation */}
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="font-semibold text-lg mb-3 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                                Location & Career
                            </h2>

                            <div className="space-y-3">
                                {profile.location && (
                                    <div className="flex items-start">
                                        <Home className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium">Lives in</p>
                                            <p className="text-gray-600">{profile.location}</p>
                                            {profile.district && <p className="text-gray-500 text-sm">{profile.district} District</p>}
                                        </div>
                                    </div>
                                )}

                                {profile.occupation && (
                                    <div className="flex items-start">
                                        <Briefcase className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium">Occupation</p>
                                            <p className="text-gray-600">{profile.occupation}</p>
                                            {profile.company_name && <p className="text-gray-500 text-sm">{profile.company_name}</p>}
                                            {profile.job_title && <p className="text-gray-500 text-sm">{profile.job_title}</p>}
                                        </div>
                                    </div>
                                )}

                                {profile.income && (
                                    <div className="flex items-start">
                                        <IndianRupee className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium">Annual Income</p>
                                            <p className="text-gray-600">₹{profile.income} Lakhs</p>
                                        </div>
                                    </div>
                                )}

                                {profile.education && (
                                    <div className="flex items-start">
                                        <GraduationCap className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium">Education</p>
                                            <p className="text-gray-600">{profile.education}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Details */}
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="font-semibold text-lg mb-3 flex items-center">
                                <User className="w-5 h-5 mr-2 text-purple-500" />
                                Personal Details
                            </h2>

                            <div className="grid grid-cols-2 gap-3">
                                {profile.complexion && (
                                    <div>
                                        <p className="text-sm font-medium">Complexion</p>
                                        <p className="text-gray-600">{profile.complexion}</p>
                                    </div>
                                )}

                                {profile.manglik && (
                                    <div>
                                        <p className="text-sm font-medium">Manglik</p>
                                        <p className="text-gray-600">{profile.manglik}</p>
                                    </div>
                                )}

                                {profile.weight && (
                                    <div>
                                        <p className="text-sm font-medium">Weight</p>
                                        <p className="text-gray-600">{profile.weight} kg</p>
                                    </div>
                                )}

                                {profile.gotra && (
                                    <div className="col-span-2">
                                        <p className="text-sm font-medium">Gotra</p>
                                        <p className="text-gray-600">{profile.gotra}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* About */}
                    {profile.bio && (
                        <Card>
                            <CardContent className="p-4">
                                <h2 className="font-semibold text-lg mb-3 flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2 text-green-500" />
                                    About
                                </h2>
                                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="family">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="font-semibold text-lg mb-3 flex items-center">
                                <Users className="w-5 h-5 mr-2 text-orange-500" />
                                Family Details
                            </h2>

                            <div className="space-y-4">
                                {(profile.father_occupation || profile.mother_occupation) && (
                                    <div>
                                        <h3 className="font-medium mb-2">Parents</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {profile.father_occupation && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-sm font-medium">Father's Occupation</p>
                                                    <p className="text-gray-600">{profile.father_occupation}</p>
                                                </div>
                                            )}
                                            {profile.mother_occupation && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-sm font-medium">Mother's Occupation</p>
                                                    <p className="text-gray-600">{profile.mother_occupation}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {profile.family_location && (
                                    <div>
                                        <h3 className="font-medium mb-2">Family Location</h3>
                                        <p className="text-gray-600">{profile.family_location}</p>
                                    </div>
                                )}

                                {profile.siblings && (
                                    <div>
                                        <h3 className="font-medium mb-2">Siblings</h3>
                                        <p className="text-gray-600">{profile.siblings}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="font-semibold text-lg mb-3 flex items-center">
                                <Phone className="w-5 h-5 mr-2 text-red-500" />
                                Contact Information
                            </h2>

                            <div className="space-y-3">
                                {profile.mobile1 && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm font-medium mb-1">Primary Mobile</p>
                                        <p className="text-gray-600">{profile.mobile1}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" onClick={() => handleContact('call')}>
                                                <Phone className="w-4 h-4 mr-1" />
                                                Call
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleContact('whatsapp')}>
                                                <MessageCircle className="w-4 h-4 mr-1" />
                                                WhatsApp
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {profile.mobile2 && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm font-medium mb-1">Secondary Mobile</p>
                                        <p className="text-gray-600">{profile.mobile2}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" onClick={() => handleContact('call')}>
                                                <Phone className="w-4 h-4 mr-1" />
                                                Call
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleContact('whatsapp')}>
                                                <MessageCircle className="w-4 h-4 mr-1" />
                                                WhatsApp
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {!profile.mobile1 && !profile.mobile2 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Contact information is not available</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Fixed bottom contact bar */}
            {(profile.mobile1 || profile.mobile2) && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
                    <div className="flex gap-2 max-w-md mx-auto">
                        <Button
                            className="flex-1"
                            onClick={() => handleContact('call')}
                        >
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                        </Button>
                        <Button
                            className="flex-1"
                            variant="outline"
                            onClick={() => handleContact('whatsapp')}
                        >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            WhatsApp
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Skeleton loader for better UX
function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton */}
            <div className="sticky top-0 z-10 bg-white border-b shadow-sm p-4 flex items-center justify-between">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-32 h-6 rounded-md" />
                <Skeleton className="w-10 h-10 rounded-full" />
            </div>

            {/* Profile Header Skeleton */}
            <div className="p-4 bg-gradient-to-b from-white to-gray-50">
                <div className="flex items-start gap-4 mb-4">
                    <Skeleton className="w-20 h-20 rounded-full" />

                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-7 w-3/4 rounded-md" />
                        <Skeleton className="h-4 w-1/2 rounded-md" />
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    <Skeleton className="h-10 flex-1 rounded-md" />
                    <Skeleton className="h-10 flex-1 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="px-4 space-y-4">
                <Skeleton className="h-10 w-full rounded-md mb-4" />

                {[1, 2, 3].map(i => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <Skeleton className="h-6 w-40 mb-3 rounded-md" />
                            <div className="space-y-3">
                                {[1, 2, 3].map(j => (
                                    <div key={j} className="flex items-start">
                                        <Skeleton className="w-5 h-5 mr-3 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-24 rounded-md" />
                                            <Skeleton className="h-4 w-32 rounded-md" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}