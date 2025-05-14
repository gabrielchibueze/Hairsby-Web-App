git import { NextRequest, NextResponse } from "next/server";
import { distance } from "fastest-levenshtein";

// Cache for production
let cachedRoutes: string[] = [];
let cacheTimestamp = 0;

async function getRoutes(): Promise<string[]> {
  // In production, use pre-generated routes
  if (process.env.NODE_ENV === "production") {
    try {
      const routes = await import("../generated/routes.json");
      return routes.default;
    } catch (error) {
      console.error("Failed to load routes:", error);
      return [];
    }
  }

  // In development, refresh every 5 seconds
  if (Date.now() - cacheTimestamp < 5000 && cachedRoutes.length > 0) {
    return cachedRoutes;
  }

  try {
    const routes = await import("../generated/routes.json");
    cachedRoutes = routes.default;
    cacheTimestamp = Date.now();
    return cachedRoutes;
  } catch {
    return [];
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for:
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon.")
  ) {
    return NextResponse.next();
  }

  // Get valid routes
  const validRoutes = await getRoutes();

  // Check for exact match first
  if (validRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Find closest match
  let closestMatch: string | null = null;
  let minDistance = Infinity;

  for (const route of validRoutes) {
    // Skip root for non-root requests
    if (route === "/" && pathname !== "/") continue;

    // Calculate case-insensitive distance
    const d = distance(
      pathname.toLowerCase().replace(/-/g, ""),
      route.toLowerCase().replace(/-/g, "")
    );

    // Track closest match
    if (d < minDistance) {
      minDistance = d;
      closestMatch = route;
    }
  }

  // Redirect logic
  if (closestMatch && shouldRedirect(pathname, closestMatch, minDistance)) {
    const newUrl = new URL(closestMatch, request.url);
    newUrl.search = request.nextUrl.search;

    console.log(
      `Redirecting ${pathname} → ${closestMatch} (distance: ${minDistance})`
    );
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

function shouldRedirect(
  requestPath: string,
  targetPath: string,
  distance: number
): boolean {
  // Special cases for common mistakes
  const commonTypos: Record<string, string> = {
    "/term": "/terms",
    "/sign-in": "/login",
    "/signin": "/login",
    "/servce": "/services",
  };

  // Check against known typos first
  if (commonTypos[requestPath] === targetPath) {
    return true;
  }

  // Handle pluralization (service ↔ services)
  const isPluralVariant =
    (requestPath === `${targetPath}s` || targetPath === `${requestPath}s`) &&
    distance === 1;

  // Handle hyphen/space variations
  const isNormalizationCase =
    requestPath.replace(/[-_]/g, "") === targetPath.replace(/[-_]/g, "");

  // Dynamic threshold based on path length
  const threshold = Math.min(
    3, // Maximum allowed distance
    Math.max(1, Math.floor(targetPath.length / 4)) // Longer paths allow more errors
  );

  return isPluralVariant || isNormalizationCase || distance <= threshold;
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
