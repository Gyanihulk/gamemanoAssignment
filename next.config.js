/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './src/i18n.ts'
);
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'm.media-amazon.com',
          port: '',
          pathname: '/images/**',
        },
      ],
    },
    reactStrictMode: true,
    webpack: (config) => {
      config.resolve.alias.canvas = false;
  
      return config;
    },
  }
  
  module.exports = withNextIntl(nextConfig)
  