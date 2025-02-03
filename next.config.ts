import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'hamydev.s3.ap-south-1.amazonaws.com',
        pathname: '/**'
      },
      {
        protocol: 'https' as const,
        hostname: 'byoli.com',
        pathname: '/**'
      },
      {
        protocol: 'https' as const,
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https' as const,
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**'
      },
      {
        protocol: 'https' as const,
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https' as const,
        hostname: 'i.pinimg.com',
        pathname: '/**'
      },
      {
        protocol: 'https' as const,
        hostname: 'images.pexels.com',
        pathname: '/**'
      },
      {
        protocol: 'https' as const,
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https' as const,
        hostname: '*.googleusercontent.com',
        pathname: '/**'
      }
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment' as const,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  sw: '/sw.js'
})(nextConfig);

export default config;
