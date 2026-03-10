import { RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./styles.css";
import { getRouter } from "./router";

const router = getRouter();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
