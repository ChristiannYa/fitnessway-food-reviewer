export class AccessTokenStore {
    #accessToken: string | null = null;

    getAccessToken = () => this.#accessToken;
    setAccessToken = (token: string) => { this.#accessToken = token; };

    clearAccessToken = () => { this.#accessToken = null; };
}

export const accessTokenStore = new AccessTokenStore();