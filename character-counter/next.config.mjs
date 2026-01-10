import createNextIntlPlugin from 'next-intl/plugin';

// FIXED: Added path to i18n request config
const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
