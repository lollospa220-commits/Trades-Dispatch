export function getAuthSecretBytes(): Uint8Array {
  const raw = process.env.AUTH_SECRET;
  if (!raw && process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET must be set in production');
  }
  return new TextEncoder().encode(raw || 'dev-only-change-in-production');
}