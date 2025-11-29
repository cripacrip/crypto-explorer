import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import User from '../models/User.model';

export const hashPassword = async (password: string): Promise<string> => {
  // Use bcrypt to hash the password
  // genSalt and hash are both async, so we need to await them
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (user: User): string => {
  // Use jwt to generate a token
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const secret: string = process.env.JWT_SECRET || 'your_jwt_secret';

  return jwt.sign(payload, secret, { expiresIn: '1h' });
};
