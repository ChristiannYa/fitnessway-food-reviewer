import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

const config = defineConfig({
	plugins: [
		tanstackRouter(),
		viteReact(),
		tailwindcss(),
		tsconfigPaths({ projects: ["./tsconfig.json"] })
	]
});

export default config;
