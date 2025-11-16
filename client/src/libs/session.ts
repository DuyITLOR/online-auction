import { jwtVerify, SignJWT } from 'jose';
import Cookies from 'js-cookie';

const secretKet = import.meta.env.VITE_SESSION_SECRET_KEY;
const encoding = new TextEncoder().encode(secretKet);

export type UserSession = {
  name: string;
  email: string;
  avatarUrl?: string;
};

export type Session = {
  user: UserSession | null;
  token: string | null;
};

export async function createSession(payload: Session) {
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(encoding);

  console.log('session token:', session);

  console.log('payload session:', payload);

  Cookies.set('session', session, {
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const session = Cookies.get('session');

  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encoding, { algorithms: ['HS256'] });
    return payload;
  } catch (error) {
    console.error('Invalid session token', error);
    return null;
  }
}

export async function clearSession() {
  Cookies.remove('session', { path: '/' });
}
