// site/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },

  images: {
    unoptimized: true,
    remotePatterns: [
      // UploadThing / utfs
      { protocol: 'https', hostname: 'utfs.io', pathname: '/**' },
      { protocol: 'https', hostname: 'ssl.gstatic.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.cdninstagram.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.fbcdn.net', pathname: '/**' },
      { protocol: 'https', hostname: 'scontent.cdninstagram.com', pathname: '/**' },
      { protocol: 'https', hostname: 'prince-foods-media.hel1.your-objectstorage.com' },
    ],
  },

  outputFileTracingIncludes: {
    '/**/*': ['./node_modules/bcryptjs/**'],
  },
};

module.exports = nextConfig;
