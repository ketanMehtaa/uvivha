const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'];
const castes = ['Brahmin', 'Kshatriya', 'Vaishya', 'Kayastha', 'Rajput', 'Maratha'];
const motherTongues = ['Hindi', 'Marathi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu'];
const educations = ["Bachelor's", "Master's", 'Doctorate', 'Engineering', 'Medical', 'Commerce'];
const occupations = ['Private Job', 'Government Job', 'Business', 'Doctor', 'Engineer', 'Teacher'];
const incomes = ['5-10 LPA', '10-15 LPA', '15-20 LPA', '20-25 LPA', '25-30 LPA', '30+ LPA'];
const maritalStatuses = ['Never Married', 'Divorced', 'Widowed'];
const complexions = ['Very Fair', 'Fair', 'Wheatish', 'Dark'];
const familyTypes = ['Nuclear', 'Joint', 'Extended'];
const familyStatuses = ['Middle Class', 'Upper Middle Class', 'Rich/Affluent'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune'];

const getRandomElement = (array: string[]): string => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateUser = (index: number, gender: 'Male' | 'Female') => {
  const firstName = gender === 'Male' ? 
    ['Aarav', 'Vihaan', 'Arjun', 'Aditya', 'Reyansh'][index % 5] :
    ['Aanya', 'Diya', 'Saanvi', 'Ananya', 'Pari'][index % 5];
  
  const lastName = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Verma'][index % 5];
  const name = `${firstName} ${lastName}`;
  
  const age = getRandomInt(21, 35);
  const birthDate = new Date();
  birthDate.setFullYear(birthDate.getFullYear() - age);

  const height = gender === 'Male' ? getRandomInt(165, 185) : getRandomInt(155, 170);
  const weight = gender === 'Male' ? getRandomInt(60, 85) : getRandomInt(45, 65);

  const mobile = `9${getRandomInt(100000000, 999999999)}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`;

  return {
    name,
    mobile,
    password: 'password123',
    email,
    gender,
    birthDate,
    location: getRandomElement(cities),
    bio: `Hi, I'm ${firstName}. Looking forward to meeting someone special.`,
    photos: [],
    height,
    weight,
    complexion: getRandomElement(complexions),
    physicalStatus: 'Normal',
    education: getRandomElement(educations),
    educationDetails: `Graduated from top university in ${getRandomElement(cities)}`,
    occupation: getRandomElement(occupations),
    employedIn: getRandomElement(['Private Sector', 'Public Sector', 'Business']),
    companyName: `${getRandomElement(['Tech', 'Global', 'Indian', 'Future'])} ${getRandomElement(['Systems', 'Solutions', 'Corp', 'Ltd'])}`,
    jobTitle: getRandomElement(['Manager', 'Senior Engineer', 'Team Lead', 'Consultant']),
    income: getRandomElement(incomes),
    maritalStatus: getRandomElement(maritalStatuses),
    religion: getRandomElement(religions),
    caste: getRandomElement(castes),
    subcaste: null,
    motherTongue: getRandomElement(motherTongues),
    familyType: getRandomElement(familyTypes),
    familyStatus: getRandomElement(familyStatuses),
    fatherOccupation: getRandomElement(['Business', 'Service', 'Retired']),
    motherOccupation: getRandomElement(['Homemaker', 'Service', 'Business']),
    siblings: `${getRandomInt(0, 2)} Brother(s), ${getRandomInt(0, 2)} Sister(s)`,
    familyLocation: getRandomElement(cities),
    aboutFamily: 'We are a close-knit, values-driven family.',
    agePreferenceMin: age - 5,
    agePreferenceMax: age + 5,
    heightPreferenceMin: gender === 'Male' ? 155 : 165,
    heightPreferenceMax: gender === 'Male' ? 170 : 185,
    castePreference: 'Any',
    educationPreference: "Bachelor's and above",
    occupationPreference: 'Any',
    locationPreference: null,
    maritalStatusPreference: 'Never Married',
    isProfileComplete: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

async function main() {
  console.log('Start seeding...');

  // Generate 30 male profiles
  for (let i = 0; i < 30; i++) {
    const userData = generateUser(i, 'Male');
    await prisma.user.create({ data: userData });
  }

  // Generate 30 female profiles
  for (let i = 30; i < 60; i++) {
    const userData = generateUser(i, 'Female');
    await prisma.user.create({ data: userData });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 