import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    "./src/**/*.stories.@(js|jsx|ts|tsx|mdx)'",
  ],
  theme: {
    fontFamily: {
      nunitoSans: ['var(--font-family-nunito-sans)'],
      mono: ['Fira Code'],
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
