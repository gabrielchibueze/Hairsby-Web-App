/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/for-businesses",
        destination: "/solutions/for-businesses",
        permanent: true, // 301 redirect (good for SEO)
      },
    ];
  },
  images: {
    domains: [
      "hairsbyuserscloud.s3.eu-north-1.amazonaws.com",
      "https://example.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

module.exports = nextConfig;
