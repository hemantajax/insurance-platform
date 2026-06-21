//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@org/design-system',
    '@org/layout',
    '@org/data-grid',
    '@org/shared',
  ],
};

module.exports = nextConfig;
