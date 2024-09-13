import { authMiddleware } from "@clerk/nextjs";

// Protect routes to ensure only signed-in users can access localhost:3000
export default authMiddleware({
  publicRoutes: [
    '/',  
    '/home',          // Public access to the home page
    '/api/analyze', // Public access to API analyze route
  ],
  ignoredRoutes: [
    '/home',
    '/api/webhook/clerk', // Ignored route, typically for handling Clerk webhooks
  ],
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',  // Protect all routes except for static files (_next)
    '/',                       // Home page is public
    '/(api|trpc)(.*)',         // Public APIs are protected except those in publicRoutes
  ],
};
