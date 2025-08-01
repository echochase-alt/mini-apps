import { jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);

export const getToken = (tokenName) => localStorage.getItem(tokenName);

export const decodeJWT = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
};

export const updateToken = async (tokenName, newData) => {
  const token = getToken(tokenName);
  if (!token) return;

  const payload = await decodeJWT(token);
  if (!payload) return;

  const updatedPayload = {
    ...payload,
    ...newData,
  };

  const newToken = await new SignJWT(updatedPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);

  localStorage.setItem(tokenName, newToken);
};
