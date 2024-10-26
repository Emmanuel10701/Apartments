import { NextResponse } from 'next/server';
import prisma from '../../../libs/prisma';

// POST method to create a new apartment
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      minPrice,
      maxPrice,
      rentalType,
      starRating,
      propertyType,
      phoneNumber,
      email,
      address,
      availableRooms,
      kitchenImage,
      livingRoomImage,
      bedroomImage,
      apartmentImage,
    } = body;

    // Check for required fields
    const requiredFields = [name, minPrice, maxPrice, availableRooms, rentalType, propertyType, email];
    if (requiredFields.some(field => !field)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the new apartment
    const newApartment = await prisma.apartment.create({
      data: {
        name,
        minPrice: parseFloat(minPrice),
        maxPrice: parseFloat(maxPrice),
        rentalType,
        starRating: starRating ? parseInt(starRating) : 0,
        propertyType,
        phoneNumber,
        address,
        availableRooms: parseInt(availableRooms),
        user: {
          connect: { email }, // Connect the apartment to the user
        },
        kitchenImage,
        livingRoomImage,
        bedroomImage,
        apartmentImage,
      },
    });

    return NextResponse.json(newApartment, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET method to retrieve apartments
export async function GET() {
  try {
    const apartments = await prisma.apartment.findMany({
      orderBy: {
        createdAt: 'desc', // Sort by the createdAt field in descending order
      },
    });
    return NextResponse.json(apartments, { status: 200 });
  } catch (error) {
    console.error('Error fetching apartments:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
