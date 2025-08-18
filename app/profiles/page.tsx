'use client'
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Share2, MapPin, Briefcase, GraduationCap, ChevronDown, ChevronUp, X, Phone, Calendar, Users, Home } from 'lucide-react';

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

export default function Profiles() {
    const pathname = usePathname();
    const router = useRouter();

    // Extract ID from pathname
    const pathSegments = pathname.split('/').filter(Boolean);
    const isSpecificProfile = pathSegments.length > 1 && pathSegments[0] === 'profiles';
    const urlProfileId = isSpecificProfile ? pathSegments[1] : undefined;

    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState({
        gender: '',
        community: '',
        caste: '',
        district: '',
        minAge: '',
        maxAge: ''
    });

    useEffect(() => {
        const savedFilters = localStorage.getItem('matrimony-filters');
        if (savedFilters) {
            setFilters(JSON.parse(savedFilters));
        }

        if (isSpecificProfile && urlProfileId) {
            // Handle /profiles/[id] - fetch specific profile
            fetchSpecificProfile(urlProfileId);
        } else {
            // Handle /profiles - fetch all profiles with filters
            fetchProfiles();
        }
    }, [isSpecificProfile, urlProfileId]);

    useEffect(() => {
        if (!isSpecificProfile) {
            localStorage.setItem('matrimony-filters', JSON.stringify(filters));
            fetchProfiles();
        }
    }, [filters, isSpecificProfile]);

    const fetchSpecificProfile = async (profileId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profileId)
            .single();

        if (!error && data) {
            setProfiles([data]);
            setExpandedProfile(data.id);
        }
        setLoading(false);
    };

    const fetchProfiles = async () => {
        setLoading(true);
        let query = supabase
            .from('profiles')
            .select('*')
            .eq('is_profile_complete', true)
            .order('updated_at', { ascending: false });

        // Apply filters
        if (filters.gender) query = query.eq('gender', filters.gender);
        if (filters.community) query = query.eq('community', filters.community);
        if (filters.caste) query = query.eq('caste', filters.caste);
        if (filters.district) query = query.ilike('district', `%${filters.district}%`);

        // Age filter
        if (filters.minAge) {
            const maxBirthDate = new Date();
            maxBirthDate.setFullYear(maxBirthDate.getFullYear() - parseInt(filters.minAge));
            query = query.lte('birth_date', maxBirthDate.toISOString().split('T')[0]);
        }
        if (filters.maxAge) {
            const minBirthDate = new Date();
            minBirthDate.setFullYear(minBirthDate.getFullYear() - parseInt(filters.maxAge) - 1);
            query = query.gte('birth_date', minBirthDate.toISOString().split('T')[0]);
        }

        const { data, error } = await query;
        if (!error) setProfiles(data || []);
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

    const toggleExpandProfile = (profileId: string) => {
        // Always just toggle expansion, no redirection
        setExpandedProfile(expandedProfile === profileId ? null : profileId);

        // Optional: Update URL without page reload (for shareable links)
        if (expandedProfile !== profileId) {
            window.history.pushState({}, '', `/profiles/${profileId}`);
        } else {
            window.history.pushState({}, '', '/profiles');
        }
    };


    const clearFilters = () => {
        setFilters({
            gender: '',
            community: '',
            caste: '',
            district: '',
            minAge: '',
            maxAge: ''
        });
    };

    const goBackToList = () => {
        setExpandedProfile(null);
        router.push('/profiles');
    };

    const ProfileCard = ({ profile, isExpanded }: { profile: Profile; isExpanded: boolean }) => (
        <Card className={`hover:shadow-lg transition-all ${isExpanded ? 'ring-2 ring-blue-500' : ''}`}>
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-semibold text-lg">{profile.name}</h3>
                        <p className="text-sm text-gray-600">
                            {profile.birth_date && `${calculateAge(profile.birth_date)} years`}
                            {profile.gender && ` • ${profile.gender}`}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => shareProfile(profile.id, profile.name || 'Profile')}
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>
                        {isSpecificProfile && (
                            <Button variant="ghost" size="sm" onClick={goBackToList}>
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-2 mb-4">
                    {profile.location && (
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {profile.location}
                        </div>
                    )}

                    {profile.occupation && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {profile.occupation}
                            {profile.company_name && ` at ${profile.company_name}`}
                        </div>
                    )}

                    {profile.education && (
                        <div className="flex items-center text-sm text-gray-600">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {profile.education}
                        </div>
                    )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {profile.community && <Badge variant="secondary">{profile.community}</Badge>}
                    {profile.caste && <Badge variant="outline">{profile.caste}</Badge>}
                    {profile.height && <Badge variant="outline">{profile.height}cm</Badge>}
                    {profile.weight && <Badge variant="outline">{profile.weight}kg</Badge>}
                    {profile.income && <Badge variant="outline">₹{profile.income}L</Badge>}
                    {profile.marital_status && <Badge variant="outline">{profile.marital_status}</Badge>}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <div className="border-t pt-4 space-y-4">
                        {/* Contact Info */}
                        <div className="space-y-2">
                            <h4 className="font-medium flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                Contact
                            </h4>
                            {profile.mobile1 && <p className="text-sm ml-6">Primary: {profile.mobile1}</p>}
                            {profile.mobile2 && <p className="text-sm ml-6">Secondary: {profile.mobile2}</p>}
                        </div>

                        {/* Personal Details */}
                        <div className="space-y-2">
                            <h4 className="font-medium flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                Personal Details
                            </h4>
                            <div className="ml-6 text-sm space-y-1">
                                {profile.birth_date && <p>Date of Birth: {new Date(profile.birth_date).toLocaleDateString()}</p>}
                                {profile.complexion && <p>Complexion: {profile.complexion}</p>}
                                {profile.district && <p>District: {profile.district}</p>}
                                {profile.job_title && <p>Job Title: {profile.job_title}</p>}
                                {profile.manglik && <p>Manglik: {profile.manglik}</p>}
                                {profile.gotra && <p>Gotra: {profile.gotra}</p>}
                            </div>
                        </div>

                        {/* Family Details */}
                        <div className="space-y-2">
                            <h4 className="font-medium flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                Family Details
                            </h4>
                            <div className="ml-6 text-sm space-y-1">
                                {profile.father_occupation && <p>Father's Occupation: {profile.father_occupation}</p>}
                                {profile.mother_occupation && <p>Mother's Occupation: {profile.mother_occupation}</p>}
                                {profile.family_location && <p>Family Location: {profile.family_location}</p>}
                                {profile.siblings && <p>Siblings: {profile.siblings}</p>}
                            </div>
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <div className="space-y-2">
                                <h4 className="font-medium">About</h4>
                                <p className="text-sm text-gray-600">{profile.bio}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Bio Preview for collapsed */}
                {!isExpanded && profile.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {profile.bio}
                    </p>
                )}

                <Button
                    className="w-full"
                    onClick={() => toggleExpandProfile(profile.id)}
                    variant={isExpanded ? "outline" : "default"}
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            View Full Profile
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Filters - Hide when viewing specific profile */}
            {!isSpecificProfile && (
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Filters</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            <Select value={filters.gender} onValueChange={(value) => setFilters({ ...filters, gender: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filters.community} onValueChange={(value) => setFilters({ ...filters, community: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Community" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Kumaoni">Kumaoni</SelectItem>
                                    <SelectItem value="Garhwali">Garhwali</SelectItem>
                                    <SelectItem value="Jaunsari">Jaunsari</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filters.caste} onValueChange={(value) => setFilters({ ...filters, caste: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Caste" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Rajput">Rajput</SelectItem>
                                    <SelectItem value="Brahmin">Brahmin</SelectItem>
                                    <SelectItem value="Others">Others</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input
                                placeholder="District"
                                value={filters.district}
                                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                            />

                            <Input
                                placeholder="Min Age"
                                type="number"
                                value={filters.minAge}
                                onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                            />

                            <Input
                                placeholder="Max Age"
                                type="number"
                                value={filters.maxAge}
                                onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                            />
                        </div>

                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="mt-3 text-sm"
                        >
                            Clear Filters
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Results Count */}
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    {loading ? 'Loading...' :
                        isSpecificProfile ? 'Profile Details' : `${profiles.length} profiles found`
                    }
                </p>
            </div>

            {/* Profiles Grid */}
            <div className={`grid gap-4 ${isSpecificProfile ? 'grid-cols-1 max-w-4xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {profiles.map((profile) => (
                    <ProfileCard
                        key={profile.id}
                        profile={profile}
                        isExpanded={expandedProfile === profile.id}
                    />
                ))}
            </div>

            {/* Empty State */}
            {!loading && profiles.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        {isSpecificProfile ? 'Profile not found.' : 'No profiles found matching your criteria.'}
                    </p>
                    {!isSpecificProfile && (
                        <Button variant="outline" onClick={clearFilters} className="mt-2">
                            Clear Filters
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
