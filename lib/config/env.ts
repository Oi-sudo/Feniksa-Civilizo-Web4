const requiredInProduction = ['DATABASE_URL', 'APP_URL'] as const;

export function validateEnvironment() {
  if (process.env.NODE_ENV !== 'production') return;

  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  }

  if (!process.env.APP_URL?.startsWith('https://')) {
    throw new Error('APP_URL must use HTTPS in production.');
  }
}

export function getPublicAppUrl() {
  return process.env.APP_URL || 'http://localhost:3000';
}
