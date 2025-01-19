export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hamydev.s3.ap-south-1.amazonaws.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        search: ''
      }
    ],
    domains: ['images'],
    unoptimized: process.env.NODE_ENV === 'development'
  }
};
