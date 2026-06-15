const config = {
  plugins: {
    // Tailwind v4 は Lightning CSS が vendor prefix を処理するため autoprefixer は不要
    '@tailwindcss/postcss': {},
  },
}

export default config
