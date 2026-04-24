export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/thank-you", "/prep", "/book"],
      },
    ],
    sitemap: "https://modernbizops.com/sitemap.xml",
  };
}
