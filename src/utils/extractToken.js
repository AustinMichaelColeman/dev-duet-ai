export default function extractToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid or missing Authorization header');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Missing access token');
  }

  return token;
}