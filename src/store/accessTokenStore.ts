export class AccessTokenStore {
	readonly #isDev = import.meta.env.DEV;
	#accessToken: string | null = null;

	constructor() {
		if (this.#isDev) {
			this.#accessToken = sessionStorage.getItem("dev_access_token");
		}
	}

	getAccessToken = () => this.#accessToken;

	setAccessToken = (token: string) => {
		this.#accessToken = token;

		if (this.#isDev) {
			sessionStorage.setItem("dev_access_token", token);
		}
	};

	clearAccessToken = () => {
		this.#accessToken = null;

		if (this.#isDev) {
			sessionStorage.removeItem("dev_access_token");
		}
	};
}

export const accessTokenStore = new AccessTokenStore();
