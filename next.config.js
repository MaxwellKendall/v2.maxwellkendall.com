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
  // Post pages and the MCP tools read post sources at runtime, which the file
  // tracer can't see through process.cwd(), so ship them explicitly
  outputFileTracingIncludes: {
    '/blog/[slug]': ['./src/blog-posts/**/*.md'],
    '/api/mcp': ['./src/blog-posts/**/*.md'],
  },
};

module.exports = nextConfig;
