import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not defined');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
