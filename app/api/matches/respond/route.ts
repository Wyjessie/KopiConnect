import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchId, userId, status } = body;

    if (!matchId || !userId || !status) {
      return NextResponse.json(
        { error: 'Match ID, user ID, and status are required' },
        { status: 400 }
      );
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either accepted or rejected' },
        { status: 400 }
      );
    }

    // Get the match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    // Verify user is the recipient
    if (match.recipientId !== userId) {
      return NextResponse.json(
        { error: 'Only the recipient can respond to this match' },
        { status: 403 }
      );
    }

    // Update match status
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: { status },
      include: {
        initiator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ match: updatedMatch });
  } catch (error) {
    console.error('Match response error:', error);
    return NextResponse.json(
      { error: 'Failed to respond to match' },
      { status: 500 }
    );
  }
}
