import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import createNextIntlPlugin from 'next-intl/plugin';

// 1. Initialize the next-intl plugin
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  /* other config options here */
};

// 2. Wrap the Flowbite config with the NextIntl config
export default withNextIntl(withFlowbiteReact(nextConfig));
