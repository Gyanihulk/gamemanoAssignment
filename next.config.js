
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
  
  module.exports =nextConfig
  