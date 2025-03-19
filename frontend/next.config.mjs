/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Increase the maximum allowed size for API requests to handle document uploads
  //   api: {
  //     bodyParser: {
  //       sizeLimit: "10mb",
  //     },
  //   },
  // For handling AWS SDK in the client
  webpack: (config) => {
    config.externals = [...(config.externals || []), { "aws-crt": "aws-crt" }];
    return config;
  },
};

export default nextConfig;
