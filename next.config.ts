import type { NextConfig } from "next";

const gatewayUrl =
  process.env.NEXT_PUBLIC_GATEWAY_URL ||
  "https://gateway-service-production-69d0.up.railway.app";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${gatewayUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

