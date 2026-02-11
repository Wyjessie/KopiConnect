import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, age, gender, location } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        location: location || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        location: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      // Database connection errors
      if (error.message.includes('SQLITE') || error.message.includes('database')) {
        return NextResponse.json(
          { error: 'Database error. Please ensure the database is set up correctly. Run: npx prisma migrate dev' },
          { status: 500 }
        );
      }
      
      // Prisma client errors
      if (error.message.includes('PrismaClient')) {
        return NextResponse.json(
          { error: 'Database client error. Please run: npx prisma generate' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to register user. Please check server logs for details.' },
      { status: 500 }
    );
  }
}