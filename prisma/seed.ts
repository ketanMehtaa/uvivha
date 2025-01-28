import { PrismaClient, Complexion, MaritalStatus, Community } from '@prisma/client'
import { readFileSync } from 'fs'
import { parse as parseDate } from 'date-fns'
import { join } from 'path'
import { fileURLToPath } from 'url'

const prisma = new PrismaClient()

interface UserData { 
  id: number
  url: string
  images: string[]
  basic_info: {
    'First Name': string
    'Last Name': string
    Gender: string
    Age: string
    Community: string
    'Date Of Birth': string
    Height: string
    Caste: string
    'Marital Status': string
    Income: string
  }
  present_address: {
    Country: string
    State: string
    City: string
    'Postal Code': string
  }
  physical_attributes: {
    Height: string
    Weight: string
    Complexion: string
    'Body Type': string
    Disability: string
  }
  spiritual_background: {
    Community: string
    'Sub Caste': string
    Manglik: string
    Gotra: string
    'Family Value': string
  }
  lifestyle: {
    Diet: string
    'Living With': string
  }
  education: Array<{ degree: string; institution: string }>
  family_info: any
  career: Array<{
    employed_in: string
    employed_as: string
  }>
}

function parseHeight(height: string): number | null {
  const match = height.match(/(\d+\.?\d*)/)
  return match ? parseFloat(match[1]) : null
}

function parseWeight(weight: string): number | null {
  const match = weight.match(/(\d+)/)
  return match ? parseInt(match[1]) : null
}

function mapComplexion(complexion: string): Complexion {
  const complexionMap: Record<string, Complexion> = {
    'Very Fair': 'VERY_FAIR',
    'Fair': 'FAIR', 
    'Medium': 'WHEATISH',
    'Dark': 'DARK'
  } as const
  return complexionMap[complexion] || 'NONE'
}

function mapMaritalStatus(status: string): MaritalStatus {
  const statusMap: Record<string, MaritalStatus> = {
    'Never Married': 'NeverMarried',
    'Divorced': 'Divorced',
    'Widowed': 'Widowed',
    'Married': 'Married'
  } as const
  return statusMap[status] || 'NeverMarried'
}

function mapLivingWith(living: string) {
  const livingMap: { [key: string]: string } = {
    'With family': 'WithFamily',
    Alone: 'Alone',
    'Living in a shared accommodation': 'SharedAccommodation',
  }
  return livingMap[living] || 'Other'
}

function mapGender(gender: string) {
  return gender === 'Female' ? 'Female' : 'Male'
}

function mapManglik(manglik: string) {
  return manglik.toLowerCase() === 'yes' ? 'Yes' : 'No'
}

function mapCommunity(community: string): Community {
  const communityMap: Record<string, Community> = {
    'Garhwali': 'Garhwali',
    'kumaoni': 'Kumaoni',
    'Jaunsari': 'Jaunsari'
  } as const
  return communityMap[community] || null
}

// Get current directory
const __dirname = fileURLToPath(new URL('.', import.meta.url))

function formatIncome(income: string): string {
  return income.includes('lakh') ? income : 'Will tell later'
}

function mergeEducation(education: Array<{ degree: string; institution: string }>): string {
  return education.map(ed => `${ed.degree} from ${ed.institution}`).join(', ')
}

function mergeFamilyInfo(info: any): string {
  return `Father: ${info.Father}, Mother: ${info.Mother}, ${info.Brother} Brother(s) (${info.Married_Brother} married), ${info.Sister} Sister(s) (${info.Married_Sister} married)`
}

function mapEmployedIn(career: Array<{ employed_in: string; employed_as: string }>): string {
  if (!career || career.length === 0) return 'Not Specified'
  return `${career[0].employed_in || 'Not Specified'} as ${career[0].employed_as || 'Not Specified'}`
}

async function main() {
  const jsonData = JSON.parse(
    readFileSync(join(__dirname, 'data.json'), 'utf-8')
  ) as UserData[]

  for (const userData of jsonData) {
    try {
      const birthDate = parseDate(userData.basic_info['Date Of Birth'], 'dd/MM/yyyy', new Date())
      
      await prisma.user.create({
        data: {
          name: `${userData.basic_info['First Name']} ${userData.basic_info['Last Name']}`,
          mobile: `123${Math.floor(Math.random() * 9000000) + 1000000}`,
          gender: mapGender(userData.basic_info.Gender),
          birthDate,
          location: `${userData.present_address.City}, ${userData.present_address.State}, ${userData.present_address.Country}`,
          photos: userData.images,
          height: parseHeight(userData.basic_info.Height),
          weight: parseWeight(userData.physical_attributes.Weight),
          complexion: mapComplexion(userData.physical_attributes.Complexion),
          maritalStatus: mapMaritalStatus(userData.basic_info['Marital Status']),
          community: mapCommunity(userData.basic_info.Community),
          caste: userData.basic_info.Caste,
          subcaste: userData.spiritual_background['Sub Caste'],
          education: mergeEducation(userData.education),
          income: formatIncome(userData.basic_info.Income),
          aboutFamily: mergeFamilyInfo(userData.family_info),
          manglik: mapManglik(userData.spiritual_background.Manglik),
          employedIn: mapEmployedIn(userData.career),
          isProfileComplete: true,
          physicalStatus: userData.physical_attributes.Disability || null,
          educationDetails: userData.education[0]?.institution || null,
          occupation: userData.career[0]?.employed_as || null,
          companyName: userData.career[0]?.employed_in || null,
          jobTitle: userData.career[0]?.employed_as || null,
          familyType: userData.spiritual_background['Family Value'] === 'Traditional' ? 'Joint' : 'Nuclear',
          familyStatus: userData.spiritual_background['Family Value'] || null,
          fatherOccupation: userData.family_info.Father || null,
          motherOccupation: userData.family_info.Mother || null,
          siblings: `Brothers: ${userData.family_info.Brother}, Sisters: ${userData.family_info.Sister}`,
          familyLocation: userData.present_address.City || null,
        },
      })
      
      console.log(`Created user: ${userData.basic_info['First Name']} ${userData.basic_info['Last Name']}`)
    } catch (error) {
      console.error(`Error creating user ${userData.basic_info['First Name']}:`, error)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 