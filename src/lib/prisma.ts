import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();  // Instantiate PrismaClient to access the database

export default prisma;  