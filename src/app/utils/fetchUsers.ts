import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// In this file,  i have fetched the data from the api {https://randomuser.me/api/} for the 5 user for every time  
//save it in postgres db
export default async function fetchUsers(): Promise<void> {
  try {
    console.log(`[FETCH USERS] Fetching users from API...`);
    const response = await axios.get('https://randomuser.me/api/', {
      params: { results: 5 },
    });

    const users = response.data.results;

    console.log(`[FETCH USERS] Saving users to database...`);

    // Prepare user data without location
    const userData = users.map((user: any) => ({
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      gender: user.gender,
      createdAt: new Date(),
    }));

    // Insert all users in one batch and get their ids
    const createdUsers = await prisma.user.createMany({
      data: userData,
      skipDuplicates: true, //  prevent errors if users already exist
    });

    // Get the user ids based on the created emails
    const createdUserEmails = users.map((user: any) => user.email);
    const usersWithIds = await prisma.user.findMany({
      where: {
        email: { in: createdUserEmails },
      },
    });

    // Prepare location data with userId
    const locationData = users.map((user: any) => ({
      city: user.location.city,
      country: user.location.country,
      userId: usersWithIds.find((u) => u.email === user.email)?.id, // find the correct userId
    }));

    // Insert all locations in one batch
    await prisma.location.createMany({
      data: locationData,
    });

    console.log(`[FETCH USERS] Successfully saved users and locations.`);
  } catch (error) {
    console.error(`[FETCH USERS] Error occurred:`, error);
  } finally {
    await prisma.$disconnect();
  }
}
