/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  './pages/**/*.{ts,tsx}',
	  './components/**/*.{ts,tsx}',
	  './app/**/*.{ts,tsx}',
	  './src/**/*.{ts,tsx}',
	],
	theme: {
	  extend: {
		colors: {
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		typography: () => ({
		  DEFAULT: {
			css: {
			  maxWidth: '65ch',
			  color: 'inherit',
			  p: {
				fontSize: '1rem',
				lineHeight: '1.75',
			  },
			  h1: {
				fontSize: '2rem',
				marginTop: '1.5em',
				marginBottom: '0.5em',
			  },
			  h2: {
				fontSize: '1.5rem',
				marginTop: '1.25em',
				marginBottom: '0.5em',
			  },
			  h3: {
				fontSize: '1.25rem',
				marginTop: '1em',
				marginBottom: '0.5em',
			  },
			  'ul, ol': {
				paddingLeft: '1.25em',
			  },
			  li: {
				marginTop: '0.25em',
				marginBottom: '0.25em',
			  },
			  img: {
				marginTop: '1em',
				marginBottom: '1em',
			  },
			},
		  },
		}),
	  },
	},
	plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
  }
  