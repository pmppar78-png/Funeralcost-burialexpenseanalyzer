/**
 * Netlify Edge Function: Canonical URL Enforcement
 *
 * Prevents "Page with redirect" issues in Google Search Console.
 *
 * Instead of 301-redirecting extensionless URLs (which Google flags as
 * "Page with redirect"), this function lets Netlify serve the content
 * at extensionless paths but adds X-Robots-Tag: noindex and a canonical
 * Link header pointing to the .html version. This tells Google to index
 * only the .html URL without creating any redirects.
 *
 * Also redirects /index.html → / since the homepage canonical is /.
 */
export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Only handle GET/HEAD — never interfere with form submissions or API calls
  if (request.method !== "GET" && request.method !== "HEAD") {
    return context.next();
  }

  // Redirect /index.html → / (homepage canonical is /)
  if (path === "/index.html") {
    return Response.redirect(
      new URL("/" + url.search, url.origin).toString(),
      301
    );
  }

  // Root path — serve normally
  if (path === "/") {
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

  // Extensionless path — pass through to Netlify's pipeline
  const response = await context.next();

  // If Netlify returned a redirect (vanity alias) or error, pass through unchanged
  if (response.status !== 200) {
    return response;
  }

  // Netlify served content at the extensionless URL via Pretty URL (200).
  // Instead of redirecting (which causes "Page with redirect" in GSC),
  // serve the content but signal to Google not to index this version.
  const cleanPath = path.replace(/\/+$/, "");
  const canonicalUrl = `https://funeralcostanalyzer.com${cleanPath}.html`;

  const headers = new Headers(response.headers);
  // Tell search engines: don't index this extensionless URL
  headers.set("X-Robots-Tag", "noindex");
  // Reinforce canonical signal via HTTP Link header
  headers.set("Link", `<${canonicalUrl}>; rel="canonical"`);

  return new Response(response.body, {
    status: 200,
    headers,
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
    "/ads.txt",
    "/humans.txt",
    "/.netlify/*",
  ],
};
