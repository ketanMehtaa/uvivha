import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { HighlightInit } from '@highlight-run/next/client';
import { Metadata } from 'next';
import { CSPostHogProvider } from '../lib/posthog'
import { InstallPWA } from '@/components/pwa/InstallPWA';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'Hamy - Free Uttrakhand Matrimony and Dating | Find Your Perfect Match',
  description:
    'Join Hamy - The most trusted FREE matrimonial and Dating for Uttrakhand. Create your profile for free and connect with verified matches who share your values and traditions. Get 3 months free access today!',
  keywords: [
    'free matrimony',
    'uttrakhand matrimony',
    'matrimonial site',
    'free marriage site',
    'uttrakhand marriage',
    'dehradun matrimony',
    'haridwar matrimony',
    'nainital matrimony',
    'pahadi matrimony',
    'free matrimonial service',
    'verified profiles',
    'trusted matrimony',
    'local matches',
    'uttrakhand wedding',
    'roorkee matrimony',
    'haldwani matrimony',
    'rudrapur matrimony',
    'kashipur matrimony',
    'rishikesh matrimony',
    'kotdwar matrimony',
    'pithoragarh matrimony',
    'almora matrimony',
    'mussoorie matrimony',
    'garhwali matrimony',
    'kumaoni matrimony',
    'uttrakhand shaadi',
    'pahari marriage',
    'uttrakhand bride',
    'uttrakhand groom',
    'dehradun marriage bureau',
    'haridwar marriage bureau',
    'uttarakhand matrimonial service',
    'garhwal matrimony',
    'kumaon matrimony',
    'uttrakhand marriage site',
    'best matrimony uttrakhand',
    'free matrimonial uttrakhand',
    'uttrakhand rishtey',
    'pauri garhwal matrimony',
    'tehri garhwal matrimony',
    'chamoli matrimony',
    'bageshwar matrimony',
    'champawat matrimony',
    'udham singh nagar matrimony',
    'uttarkashi matrimony',
    'bio data',
    'Free bio data',
    'bio data for marriage',
    'bio data maker',
    'bio data Free',
    'Free bio data for marriage in uttrakhand',
    'dating site',
    'dating app',
    'dating service',
    'dating uttrakhand',
    'dating in uttrakhand',
    'dating in dehradun',
    'dating in haridwar',
    'dating in nainital',
    'dating in mussoorie',
    'dating in rishikesh',
    'dating in kotdwar',
    'dating in pithoragarh',
    'dating in almora',
    'dating in mussoorie',
    'dating in garhwal',
    'dating in kumaon',
    'dating in uttrakhand',

  ],
  authors: [{ name: 'Hamy' }],
  creator: 'Hamy',
  publisher: 'Hamy',
  formatDetection: {
    telephone: true,
    email: true,
    address: true
  },
  metadataBase: new URL('https://hamy.com'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Hamy - Free Uttrakhand Matrimony  and Dating | Find Your Perfect Match',
    description:
      'Join Hamy - The most trusted FREE matrimonial and Dating for Uttrakhand. Create your profile for free and connect with verified matches who share your values and traditions. Get 3 months free access today!',
    url: 'https://hamy.com',
    siteName: 'Hamy',
    images: [
      {
        url: 'https://hamy.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hamy - Uttrakhand Matrimony and Dating'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamy - Free Uttrakhand Matrimony and Dating',
    description: 'Find your perfect match with our trusted matrimony and dating service',
    images: ['https://hamy.com/twitter-image.jpg'],
    creator: '@hamy'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code'
  },
  category: 'matrimony'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HighlightInit
        projectId={'jd4r419g'}
        serviceName="my-nextjs-frontend"
        tracingOrigins
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: []
        }}
      />
      <html lang="en" suppressHydrationWarning className={`${poppins.variable}`}>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link 
            rel="icon" 
            type="image/png" 
            sizes="32x32" 
            href="/favicon-32x32.png"
          />
          <link 
            rel="icon" 
            type="image/png" 
            sizes="16x16" 
            href="/favicon-16x16.png"
          />
          <link 
            rel="manifest" 
            href="/manifest.json" 
            crossOrigin="use-credentials"
          />
          <meta name="theme-color" content="#dc2626" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Hamy" />
        </head>
        <body className="flex min-h-screen w-full flex-col">
          <CSPostHogProvider>
            <InstallPWA />
            {children}
          </CSPostHogProvider>
          <Analytics />
        </body>
      </html>
    </>
  );
}
