import { useEffect } from "react";

/**
 * Automatically calls a cleanup function after a delay when a condition becomes true.
 * @param condition Trigger that determines when the timer should start
 * @param clearFn Function to call when the timer expires
 * @param delay Time in milliseconds to wait before calling clearFn (default: 5000)
 */
export function useAutoClear(condition: boolean, clearFn: () => void, delay = 5000) {
	useEffect(() => {
		if (!condition) return;
		const timer = setTimeout(clearFn, delay);
		return () => clearTimeout(timer);
	}, [condition, clearFn]);
}
