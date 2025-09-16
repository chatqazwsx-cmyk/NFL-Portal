import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: { colors: { brand: { 1:"#0B132B", 2:"#1C2541", 3:"#3A506B", 4:"#5BC0BE", 5:"#FAF9F6" } } }
  },
  plugins: [],
} satisfies Config;
