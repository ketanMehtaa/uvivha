import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from 'lucide-react';
import castes from '@/data/castes.json';

interface CastesData {
  [key: string]: {
    subcastes: string[];
  };
}

const castesData = castes as CastesData;

export interface FilterValues {
  ageRange: { min: number; max: number };
  heightRange: { min: number; max: number };
  weightRange: { min: number; max: number };
  caste: string;
  subcaste: string;
  education: string;
  educationDetails: string;
  occupation: string;
  employedIn: string;
  income: string;
  location: string;
  maritalStatus: string;
  complexion: string;
  physicalStatus: string;
  familyType: string;
  familyStatus: string;
}

interface FiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

const defaultFilters: FilterValues = {
  ageRange: { min: 18, max: 50 },
  heightRange: { min: 140, max: 200 },
  weightRange: { min: 40, max: 120 },
  caste: 'none',
  subcaste: 'none',
  education: 'none',
  educationDetails: '',
  occupation: 'none',
  employedIn: 'none',
  income: 'none',
  location: '',
  maritalStatus: 'none',
  complexion: 'none',
  physicalStatus: 'none',
  familyType: 'none',
  familyStatus: 'none',
};

export default function Filters({ onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);

  const handleChange = (field: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      // Check if it's a range object
      if ('min' in value && 'max' in value) {
        const defaultValue = defaultFilters[key as keyof FilterValues];
        return value.min !== (defaultValue as any).min || value.max !== (defaultValue as any).max;
      }
    }
    return value !== 'none' && value !== '';
  }).length;

  return (
    <div className="bg-card rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setFilters(defaultFilters);
              onFilterChange(defaultFilters);
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="basic">
          <AccordionTrigger>Basic Details</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Age Range</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={filters.ageRange.min}
                    onChange={(e) => handleChange('ageRange', { ...filters.ageRange, min: parseInt(e.target.value) })}
                    className="w-20"
                    min="18"
                    max="100"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    value={filters.ageRange.max}
                    onChange={(e) => handleChange('ageRange', { ...filters.ageRange, max: parseInt(e.target.value) })}
                    className="w-20"
                    min="18"
                    max="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Height Range (cm)</label>
                <Slider
                  defaultValue={[filters.heightRange.min, filters.heightRange.max]}
                  max={200}
                  min={140}
                  step={1}
                  onValueChange={(value) => handleChange('heightRange', { min: value[0], max: value[1] })}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{filters.heightRange.min}cm</span>
                  <span>{filters.heightRange.max}cm</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Weight Range (kg)</label>
                <Slider
                  defaultValue={[filters.weightRange.min, filters.weightRange.max]}
                  max={120}
                  min={40}
                  step={1}
                  onValueChange={(value) => handleChange('weightRange', { min: value[0], max: value[1] })}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{filters.weightRange.min}kg</span>
                  <span>{filters.weightRange.max}kg</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Physical Status</label>
                <Select
                  value={filters.physicalStatus}
                  onValueChange={(value) => handleChange('physicalStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Physical Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Any</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="physically_challenged">Physically Challenged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Complexion</label>
                <Select
                  value={filters.complexion}
                  onValueChange={(value) => handleChange('complexion', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Complexion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Any</SelectItem>
                    <SelectItem value="very_fair">Very Fair</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="wheatish">Wheatish</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="background">
          <AccordionTrigger>Background</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Caste</label>
                <Select
                  value={filters.caste}
                  onValueChange={(value) => {
                    handleChange('caste', value);
                    handleChange('subcaste', 'none'); // Reset subcaste when caste changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Caste" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All Castes</SelectItem>
                    {Object.keys(castesData).map((caste) => (
                      <SelectItem key={caste} value={caste.toLowerCase()}>{caste}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filters.caste !== 'none' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subcaste</label>
                  <Select
                    value={filters.subcaste}
                    onValueChange={(value) => handleChange('subcaste', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subcaste" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">All Subcastes</SelectItem>
                      {castesData[filters.caste.charAt(0).toUpperCase() + filters.caste.slice(1)]?.subcastes.map((subcaste: string) => (
                        <SelectItem key={subcaste} value={subcaste.toLowerCase()}>{subcaste}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger>Education & Career</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Education Level</label>
                <Select
                  value={filters.education}
                  onValueChange={(value) => handleChange('education', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All Education Levels</SelectItem>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="bachelor">Bachelor&apos;s Degree</SelectItem>
                    <SelectItem value="master">Master&apos;s Degree</SelectItem>
                    <SelectItem value="phd">PhD/Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Employed In</label>
                <Select
                  value={filters.employedIn}
                  onValueChange={(value) => handleChange('employedIn', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All Types</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="self_employed">Self Employed</SelectItem>
                    <SelectItem value="not_working">Not Working</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Occupation</label>
                <Select
                  value={filters.occupation}
                  onValueChange={(value) => handleChange('occupation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All Occupations</SelectItem>
                    <SelectGroup>
                      <SelectLabel>Technology</SelectLabel>
                      <SelectItem value="software">Software Professional</SelectItem>
                      <SelectItem value="hardware">Hardware Professional</SelectItem>
                      <SelectItem value="it_other">Other IT</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Medicine</SelectLabel>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="medical_other">Other Medical</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Others</SelectLabel>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="ca">Chartered Accountant</SelectItem>
                      <SelectItem value="lawyer">Lawyer</SelectItem>
                      <SelectItem value="business_person">Business Person</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Annual Income</label>
                <Select
                  value={filters.income}
                  onValueChange={(value) => handleChange('income', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Income Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All Income Ranges</SelectItem>
                    <SelectItem value="0-3">0-3 LPA</SelectItem>
                    <SelectItem value="3-6">3-6 LPA</SelectItem>
                    <SelectItem value="6-10">6-10 LPA</SelectItem>
                    <SelectItem value="10-15">10-15 LPA</SelectItem>
                    <SelectItem value="15-25">15-25 LPA</SelectItem>
                    <SelectItem value="25+">25+ LPA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="family">
          <AccordionTrigger>Family Details</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Family Type</label>
                <Select
                  value={filters.familyType}
                  onValueChange={(value) => handleChange('familyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Family Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All Types</SelectItem>
                    <SelectItem value="joint">Joint Family</SelectItem>
                    <SelectItem value="nuclear">Nuclear Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Family Status</label>
                <Select
                  value={filters.familyStatus}
                  onValueChange={(value) => handleChange('familyStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Family Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All</SelectItem>
                    <SelectItem value="middle_class">Middle Class</SelectItem>
                    <SelectItem value="upper_middle">Upper Middle Class</SelectItem>
                    <SelectItem value="rich">Rich</SelectItem>
                    <SelectItem value="affluent">Affluent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <label className="text-sm font-medium">City or State</label>
              <Input
                type="text"
                value={filters.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Enter location"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="marital">
          <AccordionTrigger>Marital Status</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Select
                value={filters.maritalStatus}
                onValueChange={(value) => handleChange('maritalStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All</SelectItem>
                  <SelectItem value="never_married">Never Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="awaiting_divorce">Awaiting Divorce</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 