import { db } from '../drizzle'; // Import your Drizzle instance

export const getUserById = async (userId: string) => {
  return await db.query('SELECT * FROM users WHERE id = $1', [userId]);
};
