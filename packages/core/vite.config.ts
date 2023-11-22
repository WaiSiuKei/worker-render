import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  base: './',
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  plugins: [
    checker({ typescript: true })
    // checker({ typescript: true, tsconfigPath: './tsconfig.json' })
  ]
});
