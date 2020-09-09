// tailwind.config.js
module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
  ],
  theme: {
    extend: {
      textColor: {
        primary: "var(--color-text-primary)",
        inverse: "var(--color-text-inverse)",
        'link-primary': "var(--color-link-primary)",
        'link-hover': "var(--color-link-hover)"
      },
      backgroundColor: {
        primary: "var(--color-bg-primary)",
        secondary: "var(--color-bg-secondary)",
        tertiary: "var(--color-bg-tertiary)",
        inverse: "var(--color-bg-inverse)",
        'table-stripe': "var(--color-bg-table-stripe)",
      },
      borderColor: {
        primary: "var(--color-border-primary)",
        secondary: "var(--color-border-secondary)",
        tertiary: "var(--color-border-tertiary)",
      },
      spacing: {
        '128': '32rem'
      }
    }
  },
  variants: {},
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
  }
}