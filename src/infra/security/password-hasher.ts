import { pbkdf2 as pbkdf2Callback, randomBytes, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64;
const PBKDF2_ITERATIONS = 300000;
const PBKDF2_DIGEST = 'sha512';

function pbkdf2Async(
  plain: string,
  salt: string,
  iterations: number,
  keyLength: number,
  digest: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    pbkdf2Callback(plain, salt, iterations, keyLength, digest, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(derivedKey as Buffer);
    });
  });
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const pepper = process.env.PASSWORD_PEPPER ?? '';
  const derived = await pbkdf2Async(`${plain}${pepper}`, salt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${PBKDF2_DIGEST}$${salt}$${derived.toString('hex')}`;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const [algo, iterations, digest, salt, hash] = stored.split('$');
  if (algo !== 'pbkdf2' || !salt || !hash || !iterations || !digest) {
    return false;
  }
  const pepper = process.env.PASSWORD_PEPPER ?? '';
  const derived = await pbkdf2Async(
    `${plain}${pepper}`,
    salt,
    Number(iterations),
    KEY_LENGTH,
    digest,
  );
  const expected = Buffer.from(hash, 'hex');
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}
