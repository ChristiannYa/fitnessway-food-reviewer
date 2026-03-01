function getEnvValue(key: string): string {
  const value = import.meta.env[key];
  if (!value) throw new Error(`${key} not found in .env file`);
  return value;
}

export const envValues = {
  apiBaseUrl: getEnvValue("VITE_API_BASE_URL")
};