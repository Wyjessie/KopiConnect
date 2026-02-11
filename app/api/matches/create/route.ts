import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      initiatorId,
      recipientId,
      proposedDate,
      proposedTime,
      proposedLocation,
      matchScore,
    } = body;

    if (!initiatorId || !recipientId) {
      return NextResponse.json(
        { error: 'Initiator and recipient IDs are required' },
        { status: 400 }
      );
    }

    // Check if match already exists
    const existingMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { initiatorId, recipientId },
          { initiatorId: recipientId, recipientId: initiatorId },
        ],
      },
    });

    if (existingMatch) {
      return NextResponse.json(
        { error: 'Match request already exists' },
        { status: 400 }
      );
    }

    // Create match
    const match = await prisma.match.create({
      data: {
        initiatorId,
        recipientId,
        status: 'pending',
        proposedDate: proposedDate ? new Date(proposedDate) : null,
        proposedTime: proposedTime || null,
        proposedLocation: proposedLocation || null,
        matchScore: matchScore || null,
      },
      include: {
        initiator: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true,
            location: true,
            bio: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true,
            location: true,
            bio: true,
          },
        },
      },
    });

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    console.error('Match creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
}
