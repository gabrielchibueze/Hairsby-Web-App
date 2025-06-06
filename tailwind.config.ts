// import type { Config } from "tailwindcss";

// const config = {
//   darkMode: ["class"],
//   content: [
//     "./pages/**/*.{ts,tsx}",
//     "./components/**/*.{ts,tsx}",
//     "./app/**/*.{ts,tsx}",
//     "./src/**/*.{ts,tsx}",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "1rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         border: "var(--border)",
//         input: "var(--input)",
//         ring: "var(--ring)",
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//         primary: {
//           DEFAULT: "var(--primary)",
//           foreground: "var(--primary-foreground)",
//         },
//         secondary: {
//           DEFAULT: "var(--secondary)",
//           foreground: "var(--secondary-foreground)",
//         },
//         destructive: {
//           DEFAULT: "var(--destructive)",
//           foreground: "var(--destructive-foreground)",
//         },
//         muted: {
//           DEFAULT: "var(--muted)",
//           foreground: "var(--muted-foreground)",
//         },
//         accent: {
//           DEFAULT: "var(--accent)",
//           foreground: "var(--accent-foreground)",
//         },
//         popover: {
//           DEFAULT: "var(--popover)",
//           foreground: "var(--popover-foreground)",
//         },
//         card: {
//           DEFAULT: "var(--card)",
//           foreground: "var(--card-foreground)",
//         },
//         hairsby: {
//           orange: "#F9A000",
//           dark: "#0a0e17",
//           brand: "#EBECF0",
//         },
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: "0" },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: "0" },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate")],
//   important: true,
// } satisfies Config;

// export default config;

import type { Config } from "tailwindcss";

// Helper function to generate opacity variants
const withOpacity = (cssVariable: string) => {
  return {
    DEFAULT: `var(${cssVariable})`,
    10: `rgba(var(${cssVariable}-rgb), 0.1)`,
    20: `rgba(var(${cssVariable}-rgb), 0.2)`,
    30: `rgba(var(${cssVariable}-rgb), 0.3)`,
    40: `rgba(var(${cssVariable}-rgb), 0.4)`,
    50: `rgba(var(${cssVariable}-rgb), 0.5)`,
    60: `rgba(var(${cssVariable}-rgb), 0.6)`,
    70: `rgba(var(${cssVariable}-rgb), 0.7)`,
    80: `rgba(var(${cssVariable}-rgb), 0.8)`,
    90: `rgba(var(${cssVariable}-rgb), 0.9)`,
  };
};

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: withOpacity("--border"),
        input: withOpacity("--input"),
        ring: withOpacity("--ring"),
        background: withOpacity("--background"),
        foreground: withOpacity("--foreground"),
        primary: {
          ...withOpacity("--primary"),
          foreground: withOpacity("--primary-foreground"),
        },
        secondary: {
          ...withOpacity("--secondary"),
          foreground: withOpacity("--secondary-foreground"),
        },
        destructive: {
          ...withOpacity("--destructive"),
          foreground: withOpacity("--destructive-foreground"),
        },
        muted: {
          ...withOpacity("--muted"),
          foreground: withOpacity("--muted-foreground"),
        },
        accent: {
          ...withOpacity("--accent"),
          foreground: withOpacity("--accent-foreground"),
        },
        popover: {
          ...withOpacity("--popover"),
          foreground: withOpacity("--popover-foreground"),
        },
        card: {
          ...withOpacity("--card"),
          foreground: withOpacity("--card-foreground"),
        },
        // sidebar: {
        //   background: withOpacity("--sidebar-background"),
        //   foreground: withOpacity("--sidebar-foreground"),
        //   primary: withOpacity("--sidebar-primary"),
        //   "primary-foreground": withOpacity("--sidebar-primary-foreground"),
        //   accent: withOpacity("--sidebar-accent"),
        //   "accent-foreground": withOpacity("--sidebar-accent-foreground"),
        //   border: withOpacity("--sidebar-border"),
        //   ring: withOpacity("--sidebar-ring"),
        // },

        sidebar: {
          background: withOpacity("--sidebar-background"),
          foreground: withOpacity("--sidebar-foreground"),
          muted: withOpacity("--sidebar-muted"),
          accent: withOpacity("--sidebar-accent"),
          border: withOpacity("--sidebar-border"),
        },
        provider: {
          sidebar: {
            background: withOpacity("--provider-sidebar-background"),
            foreground: withOpacity("--provider-sidebar-foreground"),
            muted: withOpacity("--provider-sidebar-muted"),
            accent: withOpacity("--provider-sidebar-accent"),
            border: withOpacity("--provider-sidebar-border"),
          },
        },
        hairsby: {
          orange: "#F9A000",
          dark: "#0a0e17",
          brand: "#EBECF0",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  important: true,
} satisfies Config;

export default config;
