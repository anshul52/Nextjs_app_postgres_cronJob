import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function fetchUsers(): Promise<void> {
  try {
    console.log(`[FETCH USERS] Fetching users from API...`);
    const response = await axios.get('https://randomuser.me/api/', {
      params: { results: 5 },
    });

    const users = response.data.results;

    const userData = users.map((user: any) => ({
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      gender: user.gender,
      createdAt: new Date(),
      location: {
        city: user.location.city,
        country: user.location.country,
      },
    }));

    console.log(`[FETCH USERS] Saving users to database...`);

    for (const user of userData) {
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          gender: user.gender,
          createdAt: user.createdAt,
          locations: {
            create: {
              city: user.location.city,
              country: user.location.country,
            },
          },
        },
      });
    }

    console.log(`[FETCH USERS] Successfully saved users.`);
  } catch (error) {
    console.error(`[FETCH USERS] Error occurred:`, error);
  } finally {
    await prisma.$disconnect();
  }
}
