import jwt from 'jsonwebtoken';

const authMiddlware = (req, res, next) => {
  // get header (case-insensitive)
  const authHeader = req.headers.authorization || req.get('authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // handle Bearer token or plain token safely
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader.trim();

  console.log('Extracted token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Accept a few common payload shapes (userId, id, _id)
    req.userId = decoded.userId ?? decoded.id ?? decoded._id;

    if (!req.userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddlware;
