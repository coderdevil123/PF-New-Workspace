module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Verdant Enterprise Theme - Light Mode
        'forest-dark': '#0F3E38',
        'forest-green': '#1E5E56',
        'forest-medium': '#174F48',
        'mint-accent': '#4FD1B5',
        'soft-mint': '#E9F7F4',
        'pure-white': '#FFFFFF',
        'light-gray': '#F6F8F7',
        'border-gray': '#E4ECE9',
        'heading-dark': '#0B2F2A',
        'body-text': '#4A6A64',
        'muted-text': '#7A9B94',
        
        // Dark Mode Colors - Enhanced with Better Contrast
        'dark-bg': '#0B0F0E',
        'dark-bg-secondary': '#0E1614',
        'dark-card': '#141C1A',
        'dark-card-elevated': '#1A2420',
        'dark-hover': '#1F2D28',
        'dark-border': 'rgba(79, 209, 181, 0.2)',
        'dark-text': '#F5FAF8',
        'dark-text-secondary': '#D4E3DE',
        'dark-muted': '#A8BFB8',
        'dark-accent': 'rgba(79, 209, 181, 0.15)',
        
        border: "#E4ECE9",
        input: "#E4ECE9",
        ring: "#4FD1B5",
        background: "#FFFFFF",
        foreground: "#0B2F2A",
        primary: {
          DEFAULT: "#4FD1B5",
          foreground: "#0F3E38",
        },
        secondary: {
          DEFAULT: "#F6F8F7",
          foreground: "#0B2F2A",
        },
        tertiary: {
          DEFAULT: "#1E5E56",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F6F8F7",
          foreground: "#7A9B94",
        },
        accent: {
          DEFAULT: "#E9F7F4",
          foreground: "#1E5E56",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0B2F2A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0B2F2A",
        },
        sidebar: {
          DEFAULT: "#FFFFFF",
          foreground: "#0B2F2A",
          hover: "#F6F8F7",
        },
        navbar: {
          DEFAULT: "#FFFFFF",
          foreground: "#0B2F2A",
        },
      },
      borderRadius: {
        lg: "14px",
        md: "12px",
        sm: "8px",
      },
      fontFamily: {
        sans: ['"Source Sans 3"', "system-ui", "sans-serif"],
        display: ['"Canela"', "serif"],
        ui: ['"Neue Montreal"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      fontSize: {
        h1: ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        h2: ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        h3: ["1.75rem", { lineHeight: "1.3", fontWeight: "500" }],
        body: ["1rem", { lineHeight: "1.7", fontWeight: "400" }],
        label: ["0.875rem", { fontWeight: "500" }],
      },
      backgroundImage: {
        'forest-gradient': 'linear-gradient(135deg, #1E5E56 0%, #174F48 40%, #0F3E38 100%)',
        'mint-gradient': 'linear-gradient(135deg, #4FD1B5 0%, #3BB89F 100%)',
        'soft-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F6F8F7 100%)',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
        'card-dark': '0 2px 8px rgba(255, 255, 255, 0.1), 0 1px 4px rgba(255, 255, 255, 0.05)',
        'card-hover-dark': '0 8px 24px rgba(255, 255, 255, 0.15), 0 4px 8px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'slide-left': 'slideLeft 0.6s ease-out',
        'slide-right': 'slideRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
