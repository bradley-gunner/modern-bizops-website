/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async redirects() {
    return [
      {
        // /playbook retired 2026-08-18 (Bradley: everything goes through the
        // free Scan now). Not a 410: the page has no search equity to lose
        // (0 clicks, 11 impressions, avg position 48.5 in GSC over the six
        // months to 2026-08-17), but it IS the registered landing page for
        // four UTM campaigns, two of them still live, including PDFs already
        // in circulation and an active LinkedIn outbound test. Those are
        // people, not crawlers. Next preserves the inbound query string
        // through the redirect, so ?utm_campaign=lm_revops_playbook still
        // lands and still attributes on /scorecard. Inbound attribution,
        // same category as /ig below, not an internal UTM'd link.
        source: '/playbook',
        destination: '/scorecard',
        statusCode: 301,
      },
      {
        source: '/ig',
        destination: '/?utm_source=instagram&utm_medium=profile&utm_campaign=evergreen_home&utm_content=bio_link_v1',
        statusCode: 301,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
