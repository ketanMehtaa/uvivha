import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] bg-gradient-to-r from-pink-50 to-red-50">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                Find Your Perfect Match in
                <span className="text-red-600"> Uttrakhand</span>
              </h1>
              <p className="text-lg text-gray-600">
                Join the most trusted matrimony service for Uttrakhand. Connect with compatible matches who share your values and traditions.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/auth" 
                  className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  Register Free
                </Link>
                <Link 
                  href="/auth" 
                  className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-full hover:bg-red-50 transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative h-[500px]">
              <Image
                src="/couple-illustration.svg"
                alt="Happy Couple"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Verified Profiles</h3>
              <p className="text-gray-600">All profiles are thoroughly verified to ensure a safe and genuine matchmaking experience.</p>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Perfect Matches</h3>
              <p className="text-gray-600">Advanced matching algorithm to help you find the most compatible life partner.</p>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Privacy Control</h3>
              <p className="text-gray-600">Your privacy is our priority. Control who sees your profile and information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Journey Today</h2>
          <p className="text-xl mb-8">Join thousands of happy couples who found their soulmate through our platform</p>
          <Link 
            href="/auth" 
            className="px-8 py-4 bg-white text-red-600 rounded-full hover:bg-gray-100 transition-colors inline-block font-semibold"
          >
            Create Free Profile
          </Link>
        </div>
      </section>
    </div>
  );
} 