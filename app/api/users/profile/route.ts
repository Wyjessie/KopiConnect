import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      age,
      gender,
      background,
      bio,
      location,
      dietaryRestrictions,
      budgetMin,
      budgetMax,
      interests,
      preferredGender,
      preferredAgeMin,
      preferredAgeMax,
      preferredBackground,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        age: age ? parseInt(age) : null,
        gender: gender || null,
        background: background || null,
        bio: bio || null,
        location: location || null,
        dietaryRestrictions: dietaryRestrictions 
          ? JSON.stringify(dietaryRestrictions) 
          : null,
        budgetMin: budgetMin ? parseFloat(budgetMin) : null,
        budgetMax: budgetMax ? parseFloat(budgetMax) : null,
        interests: interests ? JSON.stringify(interests) : null,
        preferredGender: preferredGender || null,
        preferredAgeMin: preferredAgeMin ? parseInt(preferredAgeMin) : null,
        preferredAgeMax: preferredAgeMax ? parseInt(preferredAgeMax) : null,
        preferredBackground: preferredBackground || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        background: true,
        bio: true,
        location: true,
        dietaryRestrictions: true,
        budgetMin: true,
        budgetMax: true,
        interests: true,
        preferredGender: true,
        preferredAgeMin: true,
        preferredAgeMax: true,
        preferredBackground: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        background: true,
        bio: true,
        location: true,
        dietaryRestrictions: true,
        budgetMin: true,
        budgetMax: true,
        interests: true,
        preferredGender: true,
        preferredAgeMin: true,
        preferredAgeMax: true,
        preferredBackground: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
