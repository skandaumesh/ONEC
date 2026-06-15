/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return {
            fallback: [
                {
                    source: '/api/:path*',
                    destination: 'http://localhost:8080/api/:path*'
                }
            ]
        };
    }
};

export default nextConfig;