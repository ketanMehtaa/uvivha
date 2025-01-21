import { prisma } from '@/lib/prisma';

export const checkProfileCompletion = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      mobile: true,
      email: true,
      gender: true,
      birthDate: true,
      location: true,
      bio: true,
      height: true,
      education: true,
      occupation: true,
      income: true,
      maritalStatus: true,
      religion: true,
      caste: true,
      motherTongue: true,
    }
  });

  if (!user) return false;

  return Object.values(user).every(value => value !== null && value !== undefined);
};
