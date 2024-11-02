import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

          primary: '#013961', // اللون الأساسي اللي انت شغال بيه
          secondary: '#006d4e',
          gradientStart: '#013961', // بداية التدرج
          gradientEnd: '#006d4e',  // نهاية التدرج
      },
    },
  },
  plugins: [],
};
export default config;
