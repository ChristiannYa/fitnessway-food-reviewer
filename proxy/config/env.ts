function getEnvValue(key: string): string {
	const value = process.env[key];
	if (!value) throw new Error(`${key} not found in .env file`);
	return value;
}

export const envValues = {
	proxyPort: getEnvValue("PROXY_PORT")
};
