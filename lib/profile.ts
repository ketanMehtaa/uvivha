export interface UserProfile {
  name: string | null;
  mobile: string | null;
  email: string | null;
  gender: string | null;
  birthDate: Date | null;
  location: string | null;
  bio: string | null;
  height: number | null;
  education: string | null;
  occupation: string | null;
  income: string | null;
  maritalStatus: string | null;
  religion: string | null;
  caste: string | null;
  motherTongue: string | null;
  isProfileComplete?: boolean;
}

export const requiredFields = [
  'name', 'mobile', 'email', 'gender', 'birthDate', 'location',
  'bio', 'height', 'education', 'occupation', 'income',
  'maritalStatus', 'religion', 'caste', 'motherTongue'
] as const;

export type RequiredField = typeof requiredFields[number];

export const checkProfileCompletion = (user: UserProfile): boolean => {
  return requiredFields.every(field => user[field] !== null && user[field] !== undefined);
}; 