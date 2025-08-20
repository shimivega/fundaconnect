import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Theme System Colors
        "theme-bg": "hsl(var(--theme-bg))",
        "theme-bg-secondary": "hsl(var(--theme-bg-secondary))",
        "theme-bg-accent": "hsl(var(--theme-bg-accent))",
        "theme-text": "hsl(var(--theme-text))",
        "theme-text-secondary": "hsl(var(--theme-text-secondary))",
        "theme-border": "hsl(var(--theme-border))",
        "theme-primary": "hsl(var(--theme-primary))",
        "theme-secondary": "hsl(var(--theme-secondary))",
        "theme-accent": "hsl(var(--theme-accent))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Open Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "bounce-gentle": "bounce-gentle 3s infinite",
        "pulse-slow": "pulse-slow 3s infinite",
        "slide-in": "slide-in 0.5s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
        "loading": "loading 1.5s infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { 
            transform: "translateY(0px) rotateY(0deg)" 
          },
          "25%": { 
            transform: "translateY(-10px) rotateY(5deg)" 
          },
          "50%": { 
            transform: "translateY(-15px) rotateY(0deg)" 
          },
          "75%": { 
            transform: "translateY(-10px) rotateY(-5deg)" 
          },
        },
        "bounce-gentle": {
          "0%, 100%": { 
            transform: "translateY(0)" 
          },
          "50%": { 
            transform: "translateY(-10px)" 
          },
        },
        "slide-in": {
          from: { 
            transform: "translateX(-100%)", 
            opacity: "0" 
          },
          to: { 
            transform: "translateX(0)", 
            opacity: "1" 
          },
        },
        "fade-in": {
          from: { 
            opacity: "0", 
            transform: "translateY(20px)" 
          },
          to: { 
            opacity: "1", 
            transform: "translateY(0)" 
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.8",
          },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 5px hsl(var(--theme-primary)), 0 0 10px hsl(var(--theme-primary)), 0 0 15px hsl(var(--theme-primary))",
          },
          "50%": {
            boxShadow: "0 0 10px hsl(var(--theme-primary)), 0 0 20px hsl(var(--theme-primary)), 0 0 30px hsl(var(--theme-primary))",
          },
        },
        loading: {
          "0%": {
            backgroundPosition: "200% 0",
          },
          "100%": {
            backgroundPosition: "-200% 0",
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.6)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '5/4': '5 / 4',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    // Custom plugin for theme utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.themed-bg': {
          backgroundColor: 'hsl(var(--theme-bg))',
        },
        '.themed-bg-secondary': {
          backgroundColor: 'hsl(var(--theme-bg-secondary))',
        },
        '.themed-bg-accent': {
          backgroundColor: 'hsl(var(--theme-bg-accent))',
        },
        '.themed-bg-gradient': {
          background: 'linear-gradient(135deg, hsl(var(--theme-bg)) 0%, hsl(var(--theme-bg-secondary)) 100%)',
        },
        '.themed-text': {
          color: 'hsl(var(--theme-text))',
        },
        '.themed-text-secondary': {
          color: 'hsl(var(--theme-text-secondary))',
        },
        '.themed-border': {
          borderColor: 'hsl(var(--theme-border))',
        },
        '.theme-transition': {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.glassmorphism': {
          backdropFilter: 'blur(16px) saturate(180%)',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
        },
        '.glassmorphism-dark': {
          backdropFilter: 'blur(16px) saturate(180%)',
          background: 'rgba(17, 25, 40, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.125)',
          borderRadius: '12px',
        },
        '.transform-3d': {
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
