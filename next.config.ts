import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  env: {
    //If you wan to run your local api folder then need to comment this below line
    API_URL: "https://bigdeal-api-git-main-pixelstrapthemes.vercel.app/",

    //If you wan to run your local api folder then need to uncomment this below line
    // API_URL: "http://localhost:8000/graphql",
  },
  webpack(config: { module: { rules: { test: RegExp; use: { loader: string; options: { limit: number } } }[] } }) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 8192,
        },
      },
    });

    return config;
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
