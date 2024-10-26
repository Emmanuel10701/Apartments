import { NextResponse } from 'next/server';
import prisma from '../../../libs/prisma'; // Adjust the import according to your project structure

export async function POST(request) {
  const { email } = await request.json();

  // Validate email
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  try {
    // Check if the email already exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      return NextResponse.json({ error: 'Email already exists.' }, { status: 409 }); // Conflict status
    }

    // Create a new subscription
    const subscription = await prisma.subscription.create({
      data: {
        email,
      },
    });

    return NextResponse.json({ message: 'Subscription successful!', subscription }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Subscription failed. Please try again later.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: {
        createdAt: 'desc', // Assuming you have a `createdAt` field for timestamps
      },
    });

    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions.' }, { status: 500 });
  }
}
