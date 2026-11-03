/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // The MCP tools read post sources at runtime, so ship them with the function
  outputFileTracingIncludes: {
    '/api/mcp': ['./src/blog-posts/**/*.md'],
  },
};

module.exports = nextConfig;
