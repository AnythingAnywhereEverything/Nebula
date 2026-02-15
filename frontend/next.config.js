/** @type {import('next').NextConfig} */

const path = require("path");

const isDocker = process.env.DOCKER === "true";

const CDN_HOST = isDocker ? "nginx" : "localhost";

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@use "@styles/_variables.scss";`,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: CDN_HOST,
        port: "",
        pathname: "/cdn/**",
      },
    ],
    
    // Only allow private IP when NOT in Docker
    ...(isDocker ? {} : { dangerouslyAllowLocalIP: true }),
  },

  async rewrites() {
    return [
      {
        source: "/cdn/:path*",
        destination: `http://${CDN_HOST}/cdn/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;