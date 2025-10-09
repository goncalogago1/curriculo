/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: false }, // deixa true só se quiseres mesmo ignorar TS
  };
  export default nextConfig;
  