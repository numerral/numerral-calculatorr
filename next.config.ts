import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    // Allowing unsafe-inline for styles as it's common in Next.js, and unsafe-inline/eval for dev/some scripts if needed.
    // Adjusted to be a reasonable default that doesn't break most apps while satisfying the header requirement.
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com;"
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // ─── Fix dead internal links: /in/salary-calculator → actual page ───
      {
        source: '/in/salary-calculator',
        destination: '/in/in-hand-salary-calculator',
        permanent: true,
      },

      // ─── India-specific SALARY calculators → /in/ ───
      {
        source: '/salary-calculators/salary-after-tax',
        destination: '/in/salary-after-tax-calculator',
        permanent: true,
      },
      {
        source: '/salary-calculators/in-hand-salary',
        destination: '/in/in-hand-salary-calculator',
        permanent: true,
      },
      {
        source: '/salary-calculators/ctc-to-take-home',
        destination: '/in/ctc-to-take-home-calculator',
        permanent: true,
      },
      {
        source: '/salary-calculators/hra-salary-calculator',
        destination: '/in/hra-calculator',
        permanent: true,
      },
      {
        source: '/salary-calculators/gratuity-calculator',
        destination: '/in/gratuity-calculator',
        permanent: true,
      },
      {
        source: '/salary-calculators/bonus-calculator',
        destination: '/in/bonus-calculator',
        permanent: true,
      },

      // ─── India-specific TAX calculators → /in/ ───
      {
        source: '/tax-calculators/gst-calculator',
        destination: '/in/gst-calculator',
        permanent: true,
      },
      {
        source: '/tax-calculators/hra-exemption-calculator',
        destination: '/in/hra-exemption-calculator',
        permanent: true,
      },
      {
        source: '/tax-calculators/tds-calculator',
        destination: '/in/tds-calculator',
        permanent: true,
      },
      {
        source: '/tax-calculators/capital-gains-tax-calculator',
        destination: '/in/capital-gains-tax-calculator',
        permanent: true,
      },
      {
        source: '/tax-calculators/professional-tax-calculator',
        destination: '/in/professional-tax-calculator',
        permanent: true,
      },

      // ─── India-specific INVESTMENT calculators → /in/ ───
      {
        source: '/investment-calculators/rd-calculator',
        destination: '/in/rd-calculator',
        permanent: true,
      },
      {
        source: '/investment-calculators/nps-calculator',
        destination: '/in/nps-calculator',
        permanent: true,
      },
      {
        source: '/investment-calculators/mutual-fund-returns',
        destination: '/in/mutual-fund-returns-calculator',
        permanent: true,
      },
      {
        source: '/investment-calculators/retirement-corpus-calculator',
        destination: '/in/retirement-corpus-calculator',
        permanent: true,
      },

      // ─── India-specific LOAN calculators → /in/ ───
      {
        source: '/loan-calculators/education-loan-emi',
        destination: '/in/education-loan-calculator',
        permanent: true,
      },
      {
        source: '/loan-calculators/bike-loan-emi',
        destination: '/in/bike-loan-calculator',
        permanent: true,
      },
      {
        source: '/loan-calculators/business-loan-emi',
        destination: '/in/business-loan-calculator',
        permanent: true,
      },
      {
        source: '/loan-calculators/loan-eligibility',
        destination: '/in/loan-eligibility-calculator',
        permanent: true,
      },
      {
        source: '/investment-calculators/fire-calculator',
        destination: '/in/fire-calculator',
        permanent: true,
      },

      // ─── India-only products: redirect global duplicates → /in/ hub ───
      // PPF is a purely Indian government savings scheme
      {
        source: '/investment-calculators/ppf-calculator',
        destination: '/in/ppf-calculator',
        permanent: true,
      },
      // SIP (Systematic Investment Plan) is primarily an Indian mutual fund concept
      {
        source: '/investment-calculators/sip-calculator',
        destination: '/in/sip-calculator',
        permanent: true,
      },
      // FD global version has India-specific bank rates (SBI/HDFC/ICICI)
      {
        source: '/investment-calculators/fd-calculator',
        destination: '/in/fd-calculator',
        permanent: true,
      },

      // ─── Duplicate cooking calculator → canonical convert hub ───
      {
        source: '/cooking-calculators/grams-to-cups-converter',
        destination: '/convert/gram-to-cup-converter',
        permanent: true,
      },
      {
        source: '/cooking-calculators/cups-to-grams-converter',
        destination: '/convert/cup-to-gram-converter',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
