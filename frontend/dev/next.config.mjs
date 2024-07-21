/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: ['www.google.com.tr'],
  },
};

export default nextConfig;
