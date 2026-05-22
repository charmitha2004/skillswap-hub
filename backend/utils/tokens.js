const crypto = require('crypto');

const getSecret = () => process.env.JWT_SECRET || 'skillswap-development-secret';

const base64url = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

const sign = (value) => {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
};

const createToken = (payload) => {
  const header = base64url({ alg: 'HS256', typ: 'JWT' });
  const body = base64url({ ...payload, exp: Date.now() + 1000 * 60 * 60 * 24 });
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
};

const verifyToken = (token) => {
  const [header, body, signature] = token.split('.');
  if (!header || !body || !signature) return null;

  const expected = sign(`${header}.${body}`);
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (payload.exp < Date.now()) return null;
  return payload;
};

module.exports = { createToken, verifyToken };
