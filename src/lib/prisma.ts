// import { PrismaClient } from '@prisma/client';

// // Declare the variable for PrismaClient
// declare global {
//     var prisma: PrismaClient | undefined;  
// }
// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

// export default prisma;


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();  // Instantiate Prisma Client

export default prisma;  