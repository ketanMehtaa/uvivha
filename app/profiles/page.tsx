'use client'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    MapPin,
    Briefcase,
    GraduationCap,
    Eye,
    Share2,
    Filter,
    RefreshCw,
    Search,
    X
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

const FILTER_KEY = 'matrimony-filters-v5';
const SCROLL_KEY = 'matrimony-scroll';
const CACHE_KEY = 'matrimony-profiles-cache';
const CACHE_TIMESTAMP_KEY = 'matrimony-cache-timestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export default function Profiles() {
    const router = useRouter();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [filteredAndSortedProfiles, setFilteredAndSortedProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Default filter values
    const defaultFilters = {
        gender: '',
        community: '',
        caste: '',
        district: '',
        minAge: '',
        maxAge: '',
        minHeight: '',
        maxHeight: '',
        minIncome: '',
        maxIncome: '',
        education: '',
        occupation: '',
        marital_status: '',
        sortBy: 'updated_at',
        sortOrder: 'desc'
    };

    // Initialize filters and searchQuery from localStorage immediately
    const [filters, setFilters] = useState(() => {
        if (typeof window === 'undefined') return defaultFilters;
        
        try {
            const savedFilters = localStorage.getItem(FILTER_KEY);
            if (savedFilters) {
                const parsedFilters = JSON.parse(savedFilters);
                return { ...defaultFilters, ...parsedFilters };
            }
        } catch {
            // Ignore invalid JSON
        }
        return defaultFilters;
    });

    const [searchQuery, setSearchQuery] = useState(() => {
        if (typeof window === 'undefined') return '';
        
        try {
            const savedFilters = localStorage.getItem(FILTER_KEY);
            if (savedFilters) {
                const parsedFilters = JSON.parse(savedFilters);
                return parsedFilters.searchQuery || '';
            }
        } catch {
            // Ignore invalid JSON
        }
        return '';
    });

    const isRestored = useRef(false);

    // Check if cache is valid
    const isCacheValid = useCallback(() => {
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        if (!timestamp) return false;
        return Date.now() - parseInt(timestamp) < CACHE_DURATION;
    }, []);

    // Load from cache
    const loadFromCache = useCallback(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    }, []);

    // Save to cache
    const saveToCache = useCallback((data: Profile[]) => {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    }, []);

    // Event listener setup
    useEffect(() => {
        window.addEventListener('popstate', handlePopstate, { passive: true });
        return () => window.removeEventListener('popstate', handlePopstate);
    }, []);

    // Save filters to localStorage whenever they change
    useEffect(() => {
        const filtersToSave = {
            ...filters,
            searchQuery // Include search query in saved filters
        };
        localStorage.setItem(FILTER_KEY, JSON.stringify(filtersToSave));
    }, [filters, searchQuery]);

    // Restore scroll position
    useEffect(() => {
        if (isRestored.current) return;
        const y = sessionStorage.getItem(SCROLL_KEY);
        if (y) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(y, 10));
                isRestored.current = true;
            }, 100);
        }
    }, []);

    // Initial data load
    useEffect(() => {
        fetchProfiles();
    }, []);

    // Apply filters and sorting when filters or profiles change
    useEffect(() => {
        applyFiltersAndSort();
    }, [filters, profiles, searchQuery]);

    const handlePopstate = () => {
        setTimeout(() => {
            const y = sessionStorage.getItem(SCROLL_KEY);
            if (y) window.scrollTo(0, parseInt(y, 10));
        }, 50);
    };

    const handleProfileClick = (id: string) => {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
        router.push(`/profiles/${id}`);
    };

    const calculateAge = useCallback((birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }, []);

    const fetchProfiles = async (isBackgroundRefresh = false) => {
        if (!isBackgroundRefresh) {
            setLoading(true);
            setError(null);
        } else {
            setRefreshing(true);
        }

        // Try to load from cache first if not a forced refresh
        if (isBackgroundRefresh === false && isCacheValid()) {
            const cached = loadFromCache();
            if (cached && Array.isArray(cached)) {
                setProfiles(cached);
                setLoading(false);

                // Refresh data in background
                setTimeout(() => fetchProfiles(true), 1000);
                return;
            }
        }

        // Fetch from Supabase
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('is_profile_complete', true)
                .order('updated_at', { ascending: false });

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            if (data) {
                setProfiles(data);
                saveToCache(data);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching profiles:', err);
            setError(err instanceof Error ? err.message : 'Failed to load profiles');

            // If we have cached data, use it even if it's stale
            const cached = loadFromCache();
            if (cached && Array.isArray(cached)) {
                setProfiles(cached);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const applyFiltersAndSort = useCallback(() => {
        let filtered = [...profiles];

        // Apply search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(profile =>
                (profile.name?.toLowerCase().includes(query)) ||
                (profile.location?.toLowerCase().includes(query)) ||
                (profile.district?.toLowerCase().includes(query)) ||
                (profile.occupation?.toLowerCase().includes(query)) ||
                (profile.education?.toLowerCase().includes(query)) ||
                (profile.bio?.toLowerCase().includes(query))
            );
        }

        // Apply filters - only filter if a value is selected
        if (filters.gender) {
            filtered = filtered.filter(p => p.gender === filters.gender);
        }

        if (filters.community) {
            filtered = filtered.filter(p => p.community === filters.community);
        }

        if (filters.caste) {
            filtered = filtered.filter(p => p.caste === filters.caste);
        }

        if (filters.district) {
            filtered = filtered.filter(p =>
                p.district?.toLowerCase().includes(filters.district.toLowerCase())
            );
        }

        if (filters.education) {
            filtered = filtered.filter(p =>
                p.education?.toLowerCase().includes(filters.education.toLowerCase())
            );
        }

        if (filters.occupation) {
            filtered = filtered.filter(p =>
                p.occupation?.toLowerCase().includes(filters.occupation.toLowerCase())
            );
        }

        if (filters.marital_status) {
            filtered = filtered.filter(p => p.marital_status === filters.marital_status);
        }

        // Age filters
        if (filters.minAge) {
            const minAge = parseInt(filters.minAge);
            filtered = filtered.filter(p => {
                if (!p.birth_date) return false;
                return calculateAge(p.birth_date) >= minAge;
            });
        }

        if (filters.maxAge) {
            const maxAge = parseInt(filters.maxAge);
            filtered = filtered.filter(p => {
                if (!p.birth_date) return false;
                return calculateAge(p.birth_date) <= maxAge;
            });
        }

        // Height filters
        if (filters.minHeight) {
            const minHeight = parseInt(filters.minHeight);
            filtered = filtered.filter(p => p.height && p.height >= minHeight);
        }

        if (filters.maxHeight) {
            const maxHeight = parseInt(filters.maxHeight);
            filtered = filtered.filter(p => p.height && p.height <= maxHeight);
        }

        // Income filters
        if (filters.minIncome) {
            const minIncome = parseInt(filters.minIncome);
            filtered = filtered.filter(p => p.income && p.income >= minIncome);
        }

        if (filters.maxIncome) {
            const maxIncome = parseInt(filters.maxIncome);
            filtered = filtered.filter(p => p.income && p.income <= maxIncome);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (filters.sortBy) {
                case 'age':
                    aValue = a.birth_date ? calculateAge(a.birth_date) : 0;
                    bValue = b.birth_date ? calculateAge(b.birth_date) : 0;
                    break;
                case 'income':
                    aValue = a.income || 0;
                    bValue = b.income || 0;
                    break;
                case 'height':
                    aValue = a.height || 0;
                    bValue = b.height || 0;
                    break;
                case 'updated_at':
                default:
                    aValue = new Date(a.updated_at || 0).getTime();
                    bValue = new Date(b.updated_at || 0).getTime();
                    break;
            }

            if (filters.sortOrder === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });

        setFilteredAndSortedProfiles(filtered);
    }, [filters, profiles, searchQuery, calculateAge]);

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

    const clearFilters = () => {
        setFilters(defaultFilters);
        setSearchQuery('');
    };

    const refreshData = () => {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        fetchProfiles();
    };

    // Check if any filters are applied
    const hasActiveFilters = useMemo(() => {
        return Object.values(filters).some(value => value !== '') || searchQuery !== '';
    }, [filters, searchQuery]);

    const FilterSection = (
        <Card className="mb-6">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters & Sort
                        {hasActiveFilters && (
                            <Badge variant="secondary" className="ml-2">
                                Active
                            </Badge>
                        )}
                    </h2>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshData}
                            disabled={refreshing}
                            className="flex-1 sm:flex-none"
                        >
                            <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                            {refreshing ? 'Refreshing...' : 'Refresh Data'}
                        </Button>

                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="flex-1 sm:flex-none"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Clear All
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="sm:hidden flex-1"
                        >
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                    </div>
                </div>

                <div className="mb-4 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, location, occupation, education..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className={`grid gap-3 ${showFilters ? 'grid-cols-1' : 'hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                    <Select value={filters.gender} onValueChange={value => setFilters(f => ({ ...f, gender: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Gender">
                                {filters.gender || <span className="text-muted-foreground">Gender</span>}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Genders</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filters.community} onValueChange={value => setFilters(f => ({ ...f, community: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Community">
                                {filters.community || <span className="text-muted-foreground">Community</span>}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Communities</SelectItem>
                            <SelectItem value="Kumaoni">Kumaoni</SelectItem>
                            <SelectItem value="Garhwali">Garhwali</SelectItem>
                            <SelectItem value="Jaunsari">Jaunsari</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filters.caste} onValueChange={value => setFilters(f => ({ ...f, caste: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Caste">
                                {filters.caste || <span className="text-muted-foreground">Caste</span>}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Castes</SelectItem>
                            <SelectItem value="Rajput">Rajput</SelectItem>
                            <SelectItem value="Brahmin">Brahmin</SelectItem>
                            <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="District"
                        value={filters.district}
                        onChange={e => setFilters(f => ({ ...f, district: e.target.value }))}
                    />

                    <Input
                        placeholder="Education keywords"
                        value={filters.education}
                        onChange={e => setFilters(f => ({ ...f, education: e.target.value }))}
                    />

                    <Input
                        placeholder="Occupation keywords"
                        value={filters.occupation}
                        onChange={e => setFilters(f => ({ ...f, occupation: e.target.value }))}
                    />

                    <Select value={filters.marital_status} onValueChange={value => setFilters(f => ({ ...f, marital_status: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Marital Status">
                                {filters.marital_status || <span className="text-muted-foreground">Marital Status</span>}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Statuses</SelectItem>
                            <SelectItem value="Unmarried">Unmarried</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Min Age"
                            type="number"
                            min="18"
                            max="100"
                            value={filters.minAge}
                            onChange={e => setFilters(f => ({ ...f, minAge: e.target.value }))}
                        />
                        <Input
                            placeholder="Max Age"
                            type="number"
                            min="18"
                            max="100"
                            value={filters.maxAge}
                            onChange={e => setFilters(f => ({ ...f, maxAge: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Min Height (cm)"
                            type="number"
                            min="100"
                            max="250"
                            value={filters.minHeight}
                            onChange={e => setFilters(f => ({ ...f, minHeight: e.target.value }))}
                        />
                        <Input
                            placeholder="Max Height (cm)"
                            type="number"
                            min="100"
                            max="250"
                            value={filters.maxHeight}
                            onChange={e => setFilters(f => ({ ...f, maxHeight: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Min Income (L)"
                            type="number"
                            min="0"
                            value={filters.minIncome}
                            onChange={e => setFilters(f => ({ ...f, minIncome: e.target.value }))}
                        />
                        <Input
                            placeholder="Max Income (L)"
                            type="number"
                            min="0"
                            value={filters.maxIncome}
                            onChange={e => setFilters(f => ({ ...f, maxIncome: e.target.value }))}
                        />
                    </div>

                    <Select value={filters.sortBy} onValueChange={value => setFilters(f => ({ ...f, sortBy: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sort By">
                                {filters.sortBy === 'updated_at' ? 'Last Updated' :
                                    filters.sortBy === 'age' ? 'Age' :
                                        filters.sortBy === 'income' ? 'Income' :
                                            filters.sortBy === 'height' ? 'Height' :
                                                <span className="text-muted-foreground">Sort By</span>}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="updated_at">Last Updated</SelectItem>
                            <SelectItem value="age">Age</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="height">Height</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filters.sortOrder} onValueChange={value => setFilters(f => ({ ...f, sortOrder: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Order">
                                {filters.sortOrder === 'desc' ? 'Descending' :
                                    filters.sortOrder === 'asc' ? 'Ascending' :
                                        <span className="text-muted-foreground">Order</span>}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Descending</SelectItem>
                            <SelectItem value="asc">Ascending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );

    const ProfileCardSkeleton = () => (
        <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>

                <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                </div>

                <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
        </Card>
    );

    const ProfileCard = ({ profile }: { profile: Profile }) => (
        <Card className="hover:shadow-lg transition-all h-full flex flex-col">
            <CardContent className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-semibold text-lg">{profile.name || 'Name not provided'}</h3>
                        <p className="text-sm text-gray-600">
                            {profile.birth_date && `${calculateAge(profile.birth_date)} years`}
                            {profile.gender && ` • ${profile.gender}`}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            shareProfile(profile.id, profile.name || 'Profile');
                        }}
                        aria-label="Share profile"
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-2 mb-4 flex-grow">
                    {profile.location && (
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{profile.location}</span>
                        </div>
                    )}
                    {profile.occupation && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Briefcase className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                                {profile.occupation}
                                {profile.company_name && ` at ${profile.company_name}`}
                            </span>
                        </div>
                    )}
                    {profile.education && (
                        <div className="flex items-center text-sm text-gray-600">
                            <GraduationCap className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{profile.education}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                    {profile.community && <Badge variant="secondary">{profile.community}</Badge>}
                    {profile.caste && <Badge variant="outline">{profile.caste}</Badge>}
                    {profile.height && <Badge variant="outline">{profile.height}cm</Badge>}
                    {profile.income && <Badge variant="outline">₹{profile.income}L</Badge>}
                    {profile.marital_status && <Badge variant="outline">{profile.marital_status}</Badge>}
                </div>

                {profile.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {profile.bio}
                    </p>
                )}

                <Button
                    className="w-full mt-auto"
                    onClick={() => handleProfileClick(profile.id)}
                >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Profile
                </Button>
            </CardContent>
        </Card>
    );

    const cacheTimestamp = useMemo(() => {
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        return timestamp ? parseInt(timestamp) : null;
    }, [profiles]);

    const cacheTimeRemaining = useMemo(() => {
        if (!cacheTimestamp) return 0;
        return Math.max(0, CACHE_DURATION - (Date.now() - cacheTimestamp));
    }, [cacheTimestamp]);

    const minutesRemaining = Math.ceil(cacheTimeRemaining / (1000 * 60));

    return (
        <div className="min-h-screen bg-gray-50 p-4 container mx-auto max-w-7xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Matrimony Profiles</h1>
                <p className="text-gray-600">Browse and find compatible matches</p>
            </div>

            {FilterSection}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                    <p>{error}</p>
                    <Button variant="outline" size="sm" onClick={fetchProfiles} className="mt-2">
                        Try Again
                    </Button>
                </div>
            )}

            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-sm text-gray-600">
                    {loading ? 'Loading profiles...' : `${filteredAndSortedProfiles.length} profiles found`}
                </p>

                {cacheTimestamp && !loading && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <RefreshCw className="w-3 h-3" />
                        <span>
                            {cacheTimeRemaining > 0
                                ? `Data will refresh in ${minutesRemaining} min`
                                : 'Data is ready to refresh'
                            }
                        </span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ProfileCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <>
                    {filteredAndSortedProfiles.length > 0 ? (
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {filteredAndSortedProfiles.map((profile) => (
                                <ProfileCard key={profile.id} profile={profile} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h3>
                            <p className="text-gray-500 mb-4">
                                {hasActiveFilters
                                    ? "Try adjusting your search or filters to find more results."
                                    : "No profiles available at the moment. Please check back later."
                                }
                            </p>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear All Filters
                                </Button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}