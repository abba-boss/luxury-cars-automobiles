const requiredEnvVars = {
  VITE_API_URL: import.meta.env.VITE_API_URL
};

export const validateEnvironment = (): { valid: boolean; missing: string[] } => {
  const missing: string[] = [];
  
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });
  
  return { valid: missing.length === 0, missing };
};

export const getApiUrl = (): string => {
  return requiredEnvVars.VITE_API_URL || 'http://localhost:3001/api';
};

// Validate on app start
const envCheck = validateEnvironment();
if (!envCheck.valid) {
  console.warn('Missing environment variables:', envCheck.missing);
}
