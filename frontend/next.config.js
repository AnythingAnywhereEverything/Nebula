/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@use "@styles/_variables.scss";`,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/cdn/**",
      },
    ],
    dangerouslyAllowLocalIP: true, // NOTE: For development only
  },

  async rewrites() {
    return [
      {
        source: "/cdn/:path*",
        destination: "http://localhost/cdn/:path*",
      },
    ];
  },
};

module.exports = nextConfig;