import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig((_, mode) => {
	const env = loadEnv(mode, ".", ".env.local");
	return {
		server: {
			port: 3000,
		},
		define: {
			API_URL: JSON.stringify(env.API_URL),
		},
		plugins: [react()],
	};
});
