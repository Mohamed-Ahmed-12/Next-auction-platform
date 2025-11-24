import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Use 'http' since your URL starts with http://
        hostname: '127.0.0.1', // The specific hostname from your error
        port: '8000', // The port used by your media server
        pathname: '/media/**', // Allow images from the /media/ path and its subdirectories
      },
    ],
  },
  /* config options here */
};

export default withFlowbiteReact(nextConfig);