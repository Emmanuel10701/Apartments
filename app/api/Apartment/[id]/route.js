import { NextResponse } from 'next/server';
import prisma from '../../../../libs/prisma'; // Adjust the path if needed

// Function to extract the email from request headers
const getEmailFromRequest = (req) => {
    // Assuming the email is passed in the request headers
    const email = req.headers.get('x-user-email');
    return email;
};

// GET request: Retrieve apartments by user email
export async function GET(req) {
  const { pathname } = req.nextUrl;
  const email = pathname.split('/').pop(); // Extract email from the URL

  if (!email) {
      return new NextResponse(
          JSON.stringify({ error: 'User email is required.' }),
          { status: 400 }
      );
  }

  try {
      const apartments = await prisma.apartment.findMany({
          where: { email }, // Fetch apartments for the specified email
      });

      if (apartments.length === 0) {
          return new NextResponse(
              JSON.stringify({ error: 'No apartments found for this user.' }),
              { status: 404 }
          );
      }

      return NextResponse.json(apartments);
  } catch (error) {
      console.error('Error fetching apartments:', error);
      return new NextResponse(
          JSON.stringify({ error: 'Error fetching apartments.' }),
          { status: 500 }
      );
  }
}

// PUT request: Update an apartment by ID
export async function PUT(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Ensure the ID is at the end of the URL
  const body = await req.json();

  const {
      name,
      minPrice,
      maxPrice,
      rentalType,
      starRating,
      propertyType,
      phoneNumber,
      address,
      availableRooms,
      kitchenImage,
      livingRoomImage,
      bedroomImage,
      apartmentImage,
  } = body;

  if (!id) {
      return new NextResponse(
          JSON.stringify({ error: 'Apartment ID is required.' }),
          { status: 400 }
      );
  }

  try {
      const updatedApartment = await prisma.apartment.update({
          where: { id: String(id) },
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
              kitchenImage,
              livingRoomImage,
              bedroomImage,
              apartmentImage,
          },
      });

      return NextResponse.json(updatedApartment);
  } catch (error) {
      console.error('Error updating apartment:', error);
      return new NextResponse(
          JSON.stringify({ error: 'Error updating apartment.' }),
          { status: 500 }
      );
  }
}

// DELETE request: Delete a single apartment by ID
export async function DELETE(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Ensure the ID is at the end of the URL

  if (!id) {
      return new NextResponse(
          JSON.stringify({ error: 'Apartment ID is required.' }),
          { status: 400 }
      );
  }

  try {
      const deletedApartment = await prisma.apartment.delete({
          where: { id: String(id) },
      });

      return NextResponse.json({ message: 'Apartment deleted successfully.', apartment: deletedApartment });
  } catch (error) {
      console.error('Error deleting apartment:', error);
      if (error.code === 'P2025') { // Prisma error code for not found
          return new NextResponse(JSON.stringify({ error: 'Apartment not found.' }), { status: 404 });
      }
      return new NextResponse(
          JSON.stringify({ error: 'Failed to delete apartment. Please try again later.', details: error.message }),
          { status: 500 }
      );
  }
}
