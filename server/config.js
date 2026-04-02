export const JWT_SECRET = process.env.JWT_SECRET || 'fintrack-dev-secret-change-in-prod';
export const JWT_EXPIRES_IN = '7d';
export const PORT = process.env.PORT || 3001;
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
