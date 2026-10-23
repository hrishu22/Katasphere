import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://katasphere.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/problems", "/interview-prep"],
        disallow: ["/api/", "/dashboard", "/profile", "/problems/new"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
