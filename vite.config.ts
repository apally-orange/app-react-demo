import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// biome-ignore lint/style/noDefaultExport: needed by Vite
export default defineConfig({
	plugins: [
		tanstackRouter({
			autoCodeSplitting: true,
			target: 'react',
		}),
		react(),
	],
	server: {
		port: 3000,
	},
})
