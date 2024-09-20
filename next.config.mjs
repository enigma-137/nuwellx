  import nextPwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
	
};
const isDev = process.env.NODE_ENV !== "production";

const withPWA = nextPwa({
	dest: "public",
	register: true,
	skipWaiting: true,
	disable: isDev, // will be true in development mode
	buildExcludes: [/middleware-manifest\.json$/] // Optional: To prevent errors with middleware
  });
  

const config = withPWA({
	...nextConfig,
});

export default config;