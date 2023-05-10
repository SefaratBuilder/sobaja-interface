import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  base: "/#/swap",
  define: {
    'process.env': {},
    'global': "globalThis",
  },
  resolve: {
    alias: {
      "@binance-chain/bsc-connector": "@binance-chain/bsc-connector/dist/bsc-connector.cjs.production.min.js",
      "@web3-react/walletconnect-connector": "@web3-react/walletconnect-connector/dist/walletconnect-connector.cjs.production.min.js",
      "@web3-react/walletlink-connector": "@web3-react/walletlink-connector/dist/walletlink-connector.cjs.production.min.js",
      "@apollo/client": "@apollo/client/apollo-client.min.cjs",
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
      supported: { bigint: true },
      plugins: [NodeModulesPolyfillPlugin()],
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        // builtins(),
        // rollupNodePolyFill(),
      ],
    },
  },
})
