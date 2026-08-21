/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Belt-and-braces with the metadata + robots.ts: an HTTP header covers
  // non-HTML responses and anything that bypasses the document head.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
        ],
      },
    ];
  },
};

export default nextConfig;
