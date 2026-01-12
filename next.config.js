/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 1. Move the package config inside "experimental" (Fixes the "Unrecognized key" error)
  experimental: {
    serverComponentsExternalPackages: ["fluent-ffmpeg", "@ffmpeg-installer/ffmpeg"],
  },
  
  // 2. Add this webpack rule to be 100% safe against bundling errors
  webpack: (config) => {
    config.externals.push({
      "fluent-ffmpeg": "commonjs fluent-ffmpeg",
      "@ffmpeg-installer/ffmpeg": "commonjs @ffmpeg-installer/ffmpeg",
    });
    return config;
  },
};

// 3. Use CommonJS syntax (Fixes the "MODULE_TYPELESS_PACKAGE_JSON" warning)
module.exports = nextConfig;