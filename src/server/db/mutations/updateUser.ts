import { db } from '../drizzle'; // Import your Drizzle instance

export const updateUser = async (userId: string, userData: any) => {
  return await db.query('UPDATE users SET data = $1 WHERE id = $2', [userData, userId]);
};
