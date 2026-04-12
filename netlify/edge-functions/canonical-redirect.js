/**
 * Netlify Edge Function: Canonical URL Enforcement
 *
 * Fixes Google Search Console indexing issues:
 * - "Excluded by noindex tag" — caused by serving extensionless URLs with
 *   X-Robots-Tag: noindex. Google associated the noindex with the page itself.
 * - "Page with redirect" — extensionless URLs now 301 to .html versions.
 *   GSC will report "Page with redirect" for the extensionless URL (expected/
 *   informational), but the .html target returns 200 and gets indexed properly.
 * - "Crawled – currently not indexed" — resolved by removing the noindex signals
 *   and ensuring .html pages are the single canonical, indexable version.
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

  // Root path — serve normally with explicit index signals
  if (path === "/") {
    const response = await context.next();
    const headers = new Headers(response.headers);
    headers.set("X-Robots-Tag", "index, follow");
    headers.set(
      "Link",
      '<https://funeralcostanalyzer.com/>; rel="canonical"'
    );
    return new Response(response.body, {
      status: response.status,
      headers,
    });
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
    // .html pages: reinforce canonical and indexability via HTTP headers
    // Skip 404.html — it must stay noindex (meta tag says noindex, follow)
    if (path.endsWith(".html") && path !== "/404.html") {
      const response = await context.next();
      const headers = new Headers(response.headers);
      // If the origin returned 404 (file doesn't exist), don't add index signals
      if (response.status >= 400) {
        return response;
      }
      const canonicalUrl = `https://funeralcostanalyzer.com${path}`;
      headers.set("X-Robots-Tag", "index, follow");
      headers.set("Link", `<${canonicalUrl}>; rel="canonical"`);
      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }
    return context.next();
  }

  // Extensionless path — 301 redirect to .html version.
  // This is the correct approach: Google will index the .html target (200),
  // and the extensionless URL simply shows as "Page with redirect" in GSC
  // (informational, not an error). This avoids the previous noindex approach
  // which caused "Excluded by noindex tag" errors.
  const cleanPath = path.replace(/\/+$/, "");
  const targetUrl = `${url.origin}${cleanPath}.html${url.search}`;
  return Response.redirect(targetUrl, 301);
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
    "/og-default.svg",
    "/.netlify/*",
  ],
};
