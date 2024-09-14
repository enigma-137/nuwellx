  import nextPwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
	
};
const isDev = process.env.NODE_ENV !== "production";

const withPWA = nextPwa({
	dest: "public",
	register: true,
	disable: isDev
});

const config = withPWA({
	...nextConfig,
});

export default config;