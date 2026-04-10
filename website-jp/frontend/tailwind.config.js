/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-sc)", "var(--font-noto-jp)", "sans-serif"],
        jp: ["var(--font-noto-jp)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#8a9ca9", // 日式灰蓝色
          600: "#6c757d",
          700: "#495057",
          800: "#343a40",
          900: "#212529",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          50: "#fff9f5",
          100: "#fff3eb",
          200: "#ffe8d6",
          300: "#ffd9c0",
          400: "#ffcaa9",
          500: "#f8b195", // 日式浅粉橙色
          600: "#e67e22",
          700: "#d35400",
          800: "#c0392b",
          900: "#a93226",
        },
        accent: {
          DEFAULT: "var(--accent)",
          50: "#f4f9f9",
          100: "#e9f3f3",
          200: "#d4e7e7",
          300: "#bfdbdb",
          400: "#aacfcf", // 日式薄荷绿
          500: "#95c3c3",
          600: "#7fbcbc",
          700: "#69b5b5",
          800: "#54aeae",
          900: "#3fa7a7",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
