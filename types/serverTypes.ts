export type KtServerResponse<T> =
	| { success: true; message: string; data: T }
	| { success: false; message: string; data: null };

export type ProxyResponse<T> =
	| { success: true; data: T }
	| { success: false; data: null };
