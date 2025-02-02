import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-white">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80 md:hidden"></div>
        
        {/* Main content */}
        <div className="container mx-auto px-4 min-h-screen flex items-center py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
            {/* Left content */}
            <div className="space-y-6 md:space-y-8 relative z-10 max-w-xl">
              {/* Promotional banner */}
              <div className="inline-flex items-center gap-2 bg-white/95 px-4 py-2 rounded-full border border-red-100 shadow-md">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-semibold text-gray-900">Limited Time: 3 Months Free Access</span>
              </div>

              {/* Main heading */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Find Your Perfect Match in
                  <span className="text-red-600 block mt-2">Uttrakhand</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mt-6">
                  Join the most trusted Dating+Matrimony for Uttrakhand. Connect with compatible matches who share your values and traditions.
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/auth" 
                  className="px-8 py-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all transform hover:-translate-y-1 hover:shadow-xl text-center font-semibold shadow-lg shadow-red-200/50 text-base sm:text-lg"
                >
                  Register Free
                </Link>
                <Link 
                  href="/login" 
                  className="px-8 py-4 border-2 border-red-600 text-red-600 rounded-full hover:bg-red-50 transition-all transform hover:-translate-y-1 text-center font-semibold text-base sm:text-lg"
                >
                  Login
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-6">
                <div className="flex -space-x-4 hover:space-x-1 transition-all duration-300">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop"
                  ].map((avatarUrl, i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm hover:scale-110 transition-transform duration-300"
                    >
                      <Image
                        src={avatarUrl}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  <div className="font-semibold">1000+ Active Users</div>
                  <div>Join our growing community</div>
                </div>
              </div>
            </div>

            {/* Right content - Hero image */}
            <div className="relative md:h-[calc(100vh-8rem)] w-full max-h-[600px] hidden md:block">
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-[40px] blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute inset-0 bg-white/20 rounded-[40px] backdrop-blur-sm"></div>
              
              {/* Main image */}
              <div className="relative h-full w-full rounded-[40px] overflow-hidden shadow-2xl">
                <Image
                  src="https://i.pinimg.com/736x/04/d4/80/04d480b275331bb5f8c8fa884f0912d3.jpg"
                  alt="Happy Couple"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
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
                number: "10K+", 
                label: "Active Users",
                icon: (
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )
              },
              { 
                number: "5K+", 
                label: "Successful Matches",
                icon: (
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )
              },
              { 
                number: "100%", 
                label: "Verified Profiles",
                icon: (
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              { 
                number: "4.8/5", 
                label: "User Rating",
                icon: (
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )
              }
            ].map((stat, i) => (
              <div key={i} className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="absolute -top-4 left-6 bg-red-50 rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="mt-4">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full text-red-600 font-medium text-sm mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Why People Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the Best Matchmaking Service</h2>
            <p className="text-base md:text-lg text-gray-600">
              Designed with modern relationships in mind, our platform offers everything you need to find your perfect match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                ),
                title: "Verified Profiles",
                description: "All profiles are thoroughly verified to ensure a safe and genuine matchmaking experience."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                ),
                title: "Perfect Matches",
                description: "Advanced matching algorithm to help you find the most compatible life partner."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                ),
                title: "Privacy Control",
                description: "Your privacy is our priority. Control who sees your profile and information."
              }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="absolute -top-6 left-8">
                  <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-base md:text-lg text-gray-600">Find your perfect match in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                number: "1",
                title: "Create Profile",
                description: "Sign up and create your detailed profile with photos and preferences"
              },
              {
                number: "2",
                title: "Find Matches",
                description: "Browse through verified profiles and find your potential matches"
              },
              {
                number: "3",
                title: "Connect",
                description: "Start conversations and take the first step towards your future"
              }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg relative z-10 hover:shadow-xl transition-shadow">
                  <div className="text-3xl md:text-4xl font-bold text-red-600 mb-4">{step.number}</div>
                  <h3 className="text-lg md:text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{step.description}</p>
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
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-red-100 text-red-600 px-6 py-3 rounded-full font-semibold mb-6 animate-pulse text-sm md:text-base">
              Limited Time Offer: Up to 60% OFF + 3 Months Free
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Perfect Plan</h2>
            <p className="text-base md:text-lg text-gray-600 mb-4">Find the right plan that fits your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
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

            {/* Premium Plan */}
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

            {/* VIP Plan */}
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
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-base md:text-lg text-gray-600">Hear from our happy couples who found their perfect match</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              {
                image: "https://i.pinimg.com/736x/e2/0c/23/e20c239c12bf58116ab8534e8431c462.jpg",
                names: "Aditya & Deepika",
                date: "Married Jan 2024",
                location: "Dehradun",
                story: "Being from Dehradun, we wanted someone who shared our Pahadi values. Thanks to Hamy, we found each other and connected instantly over our love for local traditions and culture."
              },
              {
                image: "https://i.pinimg.com/736x/5e/3f/93/5e3f93143a76085eaa861f961ec0074a.jpg",
                names: "Vikram & Naina",
                date: "Married Nov 2023",
                location: "Haridwar",
                story: "Living in Haridwar, spirituality was important to both of us. Hamy helped us find the perfect match who shared our beliefs and family values. Our journey from matching to marriage was beautiful."
              },
              {
                image: "https://i.pinimg.com/736x/54/cb/8f/54cb8f74d66fe783f2421b022c264d7f.jpg",
                names: "Rohit & Prerna",
                date: "Married Dec 2023",
                location: "Nainital",
                story: "We both grew up in Nainital and wanted to find someone who appreciated the mountains as much as we do. Hamy's local matching helped us find exactly what we were looking for."
              }
            ].map((story, i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
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
                    <div className="font-semibold text-base md:text-lg">{story.names}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-base md:text-lg text-gray-600">Got questions? We've got answers</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "How does the matching process work?",
                a: "Our advanced algorithm considers multiple factors including preferences, interests, and values to suggest compatible matches."
              },
              {
                q: "Is my information secure?",
                a: "Yes, we take privacy seriously. Your information is protected and you control who can see your profile details."
              },
              {
                q: "Can I upgrade my plan later?",
                a: "Yes, you can upgrade to Premium or VIP plan anytime from your account settings."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 md:p-8 hover:bg-gray-100 transition-colors">
                <h3 className="text-lg md:text-xl font-semibold mb-2">{faq.q}</h3>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Journey Today</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Join thousands of happy couples who found their soulmate through our platform</p>
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