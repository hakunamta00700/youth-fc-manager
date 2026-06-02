import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Turso uses native SQLite addons that can't be bundled by webpack
  serverExternalPackages: [
    "@libsql/client",
    "@libsql/isomorphic-ws",
    "@prisma/adapter-libsql",
  ],
};

export default nextConfig;
