/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production"

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    // Next.js 16 blocks localhost/private IPs by default (SSRF protection).
    // Required for local MinIO (localhost:9000) during development.
    dangerouslyAllowLocalIP: isDev,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Production API (images can be served from backend)
      { protocol: "https", hostname: "api.sunagro.uz", pathname: "/**" },
      // Production site (in case absolute URLs are used)
      { protocol: "https", hostname: "sunagro.uz", pathname: "/**" },
      // Local dev
      { protocol: "http", hostname: "localhost", port: "3001", pathname: "/**" },
      // MinIO local dev
      { protocol: "http", hostname: "localhost", port: "9000", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "9000", pathname: "/**" },
      // MinIO / CDN production (adjust hostname to your deployment)
      { protocol: "https", hostname: "minio.sunagro.uz", pathname: "/**" },
      { protocol: "http", hostname: "minio.sunagro.uz", pathname: "/**" },
      { protocol: "https", hostname: "minio.snsratings.uz", pathname: "/**" },
      { protocol: "http", hostname: "minio.snsratings.uz", pathname: "/**" },
      // YouTube thumbnails (blog admin preview)
      { protocol: "https", hostname: "img.youtube.com", pathname: "/**" },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // Cache Next.js built assets aggressively
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Cache commonly requested public assets (avoid regex in `source`)
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
        source: "/favicon.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
        source: "/icon.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
        source: "/placeholder.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
        source: "/white_logo.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
        source: "/black_logo.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
        source: "/agricultural-field-with-white-agrofiber-cover-gree.jpg",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/greenhouse-with-agrofiber-material-covering-plants.jpg",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/black-mulch-fabric-in-garden-strawberry-plants-nea.jpg",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ]
  },
}

export default nextConfig
