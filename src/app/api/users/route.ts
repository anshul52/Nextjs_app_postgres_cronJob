import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);

  const gender = url.searchParams.get('gender');
  const city = url.searchParams.get('city');
  const country = url.searchParams.get('country');
  const fields = url.searchParams.get('fields')?.split(',') || [];
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  const offset = (page - 1) * limit;

  try {
    // Define the base where condition
    const whereCondition: any = {
      gender: gender || undefined,
      locations: {
        some: {
          city: city ? { contains: city, mode: 'insensitive' } : undefined,
          country: country ? { contains: country, mode: 'insensitive' } : undefined,
        },
      },
    };

    // Prepare select or include
    let selectOrInclude: any = {};
    if (fields.length > 0) {
      // Build the select object
      const select: Record<string, boolean> = {}; // Define type for dynamic keys
      fields.forEach((field) => {
        select[field] = true; // Dynamically set selected fields
      });
      selectOrInclude.select = select;
    } else {
      // Default to include locations if no fields specified
      selectOrInclude.include = {
        locations: true,
      };
    }

    // Fetch data
    const users = await prisma.user.findMany({
      where: whereCondition,
      skip: offset,
      take: limit,
      ...selectOrInclude, // Dynamically use select or include
    });

    // Fetch total count for pagination
    const total = await prisma.user.count({
      where: whereCondition,
    });

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
