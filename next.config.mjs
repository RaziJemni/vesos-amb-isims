/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp",],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 64, 128, 256, 512],
  },
}

export default nextConfig