export class AccessTokenStore {
	#accessToken: string | null = null;

	getAccessToken = () => this.#accessToken;
	setAccessToken = (token: string) => {
		console.log(`setting access token: ${token.slice(-10)}`);
		this.#accessToken = token;
	};

	clearAccessToken = () => {
		this.#accessToken = null;
	};
}

export const accessTokenStore = new AccessTokenStore();
