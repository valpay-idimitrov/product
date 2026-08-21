import type { MetadataRoute } from 'next';

/** Internal tool — disallow all crawlers outright. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
  };
}
