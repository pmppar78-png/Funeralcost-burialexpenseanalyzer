/**
 * Netlify Edge Function: Canonical URL Enforcement
 *
 * Fixes "Alternate page with proper canonical tag" issues in Google Search Console.
 *
 * Root cause: Netlify's Pretty URL feature serves page.html at both /page.html
 * and /page (without extension). Google discovers both variants, treats /page as
 * an "alternate" of /page.html, and refuses to index either properly.
 *
 * This edge function 301-redirects extensionless URLs to their .html canonical
 * versions and normalizes trailing slashes, ensuring Google sees one URL per page.
 */
export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Only redirect GET/HEAD — never redirect form submissions or API calls
  if (request.method !== "GET" && request.method !== "HEAD") {
    return context.next();
  }

  // Skip: root path and index.html (homepage canonical is /)
  if (path === "/" || path === "/index.html") {
    return context.next();
  }

  // Check if path already has a file extension
  const lastSegment = path.split("/").pop();
  const hasExtension = lastSegment.includes(".");

  if (hasExtension) {
    // Has an extension — strip trailing slash if present (e.g. /page.html/ → /page.html)
    if (path.endsWith("/")) {
      const cleaned = path.replace(/\/+$/, "");
      return Response.redirect(
        new URL(cleaned + url.search, url.origin).toString(),
        301
      );
    }
    return context.next();
  }

  // Extensionless path detected — this is the duplicate URL Google is flagging.
  // Pass through to Netlify's pipeline first to check if a vanity redirect handles it.
  const response = await context.next();

  // If Netlify returned a redirect (vanity alias like /green-burial → /green-burial-options.html),
  // or a 404/error, let that response pass through unchanged.
  if (response.status !== 200) {
    return response;
  }

  // Netlify served content at the extensionless URL via Pretty URL (200).
  // Redirect to the canonical .html version with 301 (permanent).
  const cleanPath = path.replace(/\/+$/, "");
  const canonicalUrl = new URL(
    cleanPath + ".html" + url.search,
    url.origin
  ).toString();

  return new Response(null, {
    status: 301,
    headers: {
      Location: canonicalUrl,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Redirect-Reason": "canonical-url-enforcement",
    },
  });
};

export const config = {
  path: "/*",
  excludedPath: [
    "/favicon.svg",
    "/style.css",
    "/script.js",
    "/robots.txt",
    "/sitemap.xml",
    "/humans.txt",
    "/.netlify/*",
  ],
};
