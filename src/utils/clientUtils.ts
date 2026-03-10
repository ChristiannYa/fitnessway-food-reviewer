import type { ClientResponse } from "@/types/appTypes";

export const clientSuccess = <T>(data: T): ClientResponse<T> => ({
	success: true as const,
	message: null,
	status: null,
	data: data
});

export const clientError = (message: string, status: number): ClientResponse<never> => ({
	success: false as const,
	message: message,
	status: status,
	data: null
});
