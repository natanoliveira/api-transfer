const SENSITIVE_KEYS = new Set([
  'password',
  'senha',
  'token',
  'app_token',
  'x-app-token',
  'authorization',
  'document',
  'cpf',
  'cnpj',
  'cpf_cnpj',
  'email',
]);

export function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item));
  }
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      const normalizedKey = key.toLowerCase();
      result[key] = SENSITIVE_KEYS.has(normalizedKey) ? '[redacted]' : sanitize(val);
    }
    return result;
  }
  return value;
}
