import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens: {
        sizes: {
          content: {
            DEFAULT: { value: "64rem" },
          },
        },
        colors: {
          text: {
            DEFAULT: { value: "rgba(8, 18, 26, 0.8)" },
            description: { value: "rgba(8, 18, 26, 0.6)" },
            placeholder: { value: "rgba(8, 18, 26, 0.4)" },
            disabled: { value: "rgba(8, 18, 26, 0.4)" },
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
