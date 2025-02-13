import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Star, Heart, Shield, MessageCircle, Share2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="font-bold text-xl text-red-600">
              Hamy
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                Testimonials
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Main Profile Demo */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100 shadow-sm mb-8">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-semibold text-red-600">
                  New: Smart Profile Matching
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Find Your Perfect Match in{' '}
                <span className="text-red-600 relative">
                  Uttarakhand
                  <svg
                    className="absolute w-full left-0 -bottom-2"
                    viewBox="0 0 358 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5.26172C71.1365 2.44258 141.273 1.03352 211.409 1.03352C281.545 1.03352 351.682 2.44258 356.364 5.26172"
                      stroke="#EF4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Join the most trusted Dating and Matrimony platform for
                Uttarakhand. Connect with compatible matches who share your
                values and traditions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                  >
                    Register Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Login
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-50 rounded-full">
                    <Users className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-600">10,000+ Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-50 rounded-full">
                    <Star className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-600">4.8/5 User Rating</span>
                </div>
              </div>
            </div>

            {/* Right Content - Main Profile Video Demo */}
            <div className="flex-1 w-full max-w-xl">
              <div className="relative">
                <video
                  className="max-w-full rounded-3xl border-8 border-black shadow-xl"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                >
                  <source
                    src="https://dz6rpm1p9xe7o.cloudfront.net/profile.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute -z-10 top-8 right-8 w-full h-full rounded-3xl bg-gradient-to-r from-red-500/30 to-pink-500/30 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Multiple Videos */}
      <section id="features" className="divide-y divide-gray-100">
        {/* Smart Filters Feature */}
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 h-full">
            <div className="flex flex-col lg:flex-row items-center gap-12 h-full py-16">
              <div className="w-full lg:w-1/2">
                <div className="relative h-[80vh] lg:h-[90vh]">
                  <video
                    className="w-full h-full rounded-2xl border-8 border-black shadow-xl object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  >
                    <source
                      src="https://dz6rpm1p9xe7o.cloudfront.net/filtersnew.mp4"
                      type="video/mp4"
                    />
                  </video>
                  <div className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-lg">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h3 className="text-3xl font-semibold mb-6">Smart Filters</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Find matches based on location, caste, and other preferences
                  that matter to you. Our advanced filtering system helps you
                  discover the most compatible matches quickly and efficiently.
                </p>
                <Button className="bg-red-600 hover:bg-red-700" size="lg" asChild>
                  <Link href="/auth">Try Smart Filters</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Messaging Feature */}
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 h-full">
            <div className="flex flex-col lg:flex-row items-center gap-12 h-full py-16">
              <div className="w-full lg:w-1/2">
                <div className="relative h-[80vh] lg:h-[90vh]">
                  <video
                    className="w-full h-full rounded-2xl border-8 border-black shadow-xl object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  >
                    <source
                      src="https://dz6rpm1p9xe7o.cloudfront.net/profileandmessagedemo.mp4"
                      type="video/mp4"
                    />
                  </video>
                  <div className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-lg">
                    <MessageCircle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h3 className="text-3xl font-semibold mb-6">Seamless Communication</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Connect with matches through our secure and easy-to-use
                  messaging system. Start meaningful conversations and get to
                  know your potential partner better.
                </p>
                <Button className="bg-red-600 hover:bg-red-700" size="lg" asChild>
                  <Link href="/auth">Start Chatting</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Sharing Feature */}
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 h-full">
            <div className="flex flex-col lg:flex-row items-center gap-12 h-full py-16">
              <div className="w-full lg:w-1/2">
                <div className="relative h-[80vh] lg:h-[90vh]">
                  <video
                    className="w-full h-full rounded-2xl border-8 border-black shadow-xl object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  >
                    <source
                      src="https://dz6rpm1p9xe7o.cloudfront.net/shareProfile.mp4"
                      type="video/mp4"
                    />
                  </video>
                  <div className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-lg">
                    <Share2 className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h3 className="text-3xl font-semibold mb-6">Easy Profile Sharing</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Share your profile as a biodata with family and friends outside
                  the platform. Share your Images and data together.
                </p>
                <Button className="bg-red-600 hover:bg-red-700" size="lg" asChild>
                  <Link href="/auth">Create Your Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              {
                number: '10K+',
                label: 'Active Users',
                icon: <Users className="w-6 h-6 text-red-500" />
              },
              {
                number: '5K+',
                label: 'Successful Matches',
                icon: <Heart className="w-6 h-6 text-red-500" />
              },
              {
                number: '100%',
                label: 'Verified Profiles',
                icon: <Shield className="w-6 h-6 text-red-500" />
              },
              {
                number: '4.8/5',
                label: 'User Rating',
                icon: <Star className="w-6 h-6 text-red-500" />
              }
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="absolute -top-4 left-6 bg-red-50 rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="mt-4">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-gray-600">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 md:py-24 bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full text-red-600 font-medium text-sm mb-6">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Why People Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience the Best Matchmaking Service
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Designed with modern relationships in mind, our platform offers
              everything you need to find your perfect match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                ),
                title: 'Verified Profiles',
                description:
                  'All profiles are thoroughly verified to ensure a safe and genuine matchmaking experience.'
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                ),
                title: 'Perfect Matches',
                description:
                  'Advanced matching algorithm to help you find the most compatible life partner.'
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                ),
                title: 'Privacy Control',
                description:
                  'Your privacy is our priority. Control who sees your profile and information.'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="absolute -top-6 left-8">
                  <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {feature.icon}
                    </svg>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-red-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Find your perfect match in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                number: '1',
                title: 'Create Profile',
                description:
                  'Sign up and create your detailed profile with photos and preferences'
              },
              {
                number: '2',
                title: 'Find Matches',
                description:
                  'Browse through verified profiles and find your potential matches'
              },
              {
                number: '3',
                title: 'Connect',
                description:
                  'Start conversations and take the first step towards your future'
              }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg relative z-10 hover:shadow-xl transition-shadow">
                  <div className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    {step.description}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-24 border-t-2 border-dashed border-red-200 -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-red-100 text-red-600 px-6 py-3 rounded-full font-semibold mb-6 animate-pulse text-sm md:text-base">
              Limited Time Offer: Up to 60% OFF + 3 Months Free
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Perfect Plan</h2>
            <p className="text-base md:text-lg text-gray-600 mb-4">Find the right plan that fits your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:border-red-100 transition-all transform hover:scale-105">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic</h3>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-4xl font-bold text-green-600">₹0</span>
                    <span className="text-gray-600">/3 months</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-400 line-through">900</span>
                    <span className="text-sm text-green-600 font-medium">Save 900</span>
                  </div>
                  <div className="mt-2 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    Limited Time Free!
                  </div>
                </div>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>View Limited Profiles</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic Search</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Create Profile</span>
                  </li>
                </ul>
                <Link 
                  href="/auth" 
                  className="block w-full py-3 px-6 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-all hover:shadow-md"
                >
                  Get Started Free
                </Link>
              </div>
            </div>

            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-red-500 relative transform hover:scale-105 transition-all">
              <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm font-semibold rounded-bl">
                Most Popular
              </div>
              <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-sm font-semibold rounded-br">
                100% OFF
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium</h3>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-4xl font-bold text-green-600">₹0</span>
                    <span className="text-gray-600">/6 months</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-400 line-through">₹1,500</span>
                    <span className="text-sm text-green-600 font-medium">Save ₹1,500</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>View Unlimited Profiles</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced Search Filters</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Contact Details Access</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority Support</span>
                  </li>
                </ul>
                <Link 
                  // href={`https://wa.me/917454948175?text=${encodeURIComponent('Hi Uvivha, want to buy your Premium plan')}`}
                  href="/auth" 
                  target="_blank"
                  className="block w-full py-3 px-6 text-center bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
                >
                  Get Premium
                </Link>
              </div>
            </div>

   
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative transform hover:scale-105 transition-all">
              <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-sm font-semibold rounded-br">
                60% OFF
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">VIP</h3>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-4xl font-bold">₹0</span>
                    <span className="text-gray-600">/12 months</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-400 line-through">₹2,500</span>
                    <span className="text-sm text-green-600 font-medium">Save ₹2,500</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All Premium Features</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Profile Highlighter</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Personal Matchmaker</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Background Verification</span>
                  </li>
                </ul>
                <Link 
                  // href={`https://wa.me/917454948175?text=${encodeURIComponent('Hi Uvivha, want to buy your VIP plan')}`}
                  href="/auth" 
                  target="_blank"
                  className="block w-full py-3 px-6 text-center bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
                >
                  Get VIP Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Hear from our happy couples who found their perfect match
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              {
                image:
                  'https://i.pinimg.com/736x/e2/0c/23/e20c239c12bf58116ab8534e8431c462.jpg',
                names: 'Aditya & Deepika',
                date: 'Married Jan 2024',
                location: 'Dehradun',
                story:
                  'Being from Dehradun, we wanted someone who shared our Pahadi values. Thanks to Hamy, we found each other and connected instantly over our love for local traditions and culture.'
              },
              {
                image:
                  'https://i.pinimg.com/736x/5e/3f/93/5e3f93143a76085eaa861f961ec0074a.jpg',
                names: 'Vikram & Naina',
                date: 'Married Nov 2023',
                location: 'Haridwar',
                story:
                  'Living in Haridwar, spirituality was important to both of us. Hamy helped us find the perfect match who shared our beliefs and family values. Our journey from matching to marriage was beautiful.'
              },
              {
                image:
                  'https://i.pinimg.com/736x/54/cb/8f/54cb8f74d66fe783f2421b022c264d7f.jpg',
                names: 'Rohit & Prerna',
                date: 'Married Dec 2023',
                location: 'Nainital',
                story:
                  "We both grew up in Nainital and wanted to find someone who appreciated the mountains as much as we do. Hamy's local matching helped us find exactly what we were looking for."
              }
            ].map((story, i) => (
              <div
                key={i}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 md:w-20 md:h-20">
                    <Image
                      src={story.image}
                      alt={story.names}
                      fill
                      className="rounded-full object-cover"
                      sizes="(max-width: 768px) 64px, 80px"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-base md:text-lg">
                      {story.names}
                    </div>
                    <div className="text-sm text-gray-600">{story.date}</div>
                    <div className="text-sm text-red-600">{story.location}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  "{story.story}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Got questions? We've got answers
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'How does the matching process work?',
                a: 'Our advanced algorithm considers multiple factors including preferences, interests, and values to suggest compatible matches.'
              },
              {
                q: 'Is my information secure?',
                a: 'Yes, we take privacy seriously. Your information is protected and you control who can see your profile details.'
              },
              {
                q: 'Can I upgrade my plan later?',
                a: 'Yes, you can upgrade to Premium or VIP plan anytime from your account settings.'
              }
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg p-6 md:p-8 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-red-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of happy couples who found their soulmate through our
            platform
          </p>
          <Link
            href="/auth"
            className="px-8 py-4 bg-white text-red-600 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 inline-block font-semibold shadow-lg text-base md:text-lg"
          >
            Create Free Profile
          </Link>
        </div>
      </section>
    </div>
  );
}

// export const metadata = {
//   title: 'Hamy - Free Uttarakhand Matrimony and Dating | Find Your Perfect Match',
//   description: 'Join the most trusted Dating+Matrimony for Uttarakhand. Connect with compatible matches who share your values and traditions.',
//   openGraph: {
//     title: 'Hamy - Free Uttarakhand Matrimony and Dating',
//     description: 'Join the most trusted Dating+Matrimony for Uttarakhand. Connect with compatible matches who share your values and traditions.',
//     images: [
//       {
//         url: 'https://example.com/og-image.jpg',
//         width: 1200,
//         height: 630,
//         alt: 'Hamy - Find Your Perfect Match in Uttarakhand',
//       },
//     ],
//   },
// };
