import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateMatchScore } from '@/lib/matching';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all other users
    const otherUsers = await prisma.user.findMany({
      where: {
        id: { not: userId },
      },
    });

    // Get existing matches to exclude them
    const existingMatches = await prisma.match.findMany({
      where: {
        OR: [
          { initiatorId: userId },
          { recipientId: userId },
        ],
      },
    });

    const matchedUserIds = new Set(
      existingMatches.flatMap(m => [m.initiatorId, m.recipientId])
    );

    // Calculate match scores for unmatched users
    const potentialMatches = otherUsers
      .filter(user => !matchedUserIds.has(user.id))
      .map(user => ({
        user: {
          id: user.id,
          name: user.name,
          age: user.age,
          gender: user.gender,
          location: user.location,
          bio: user.bio,
          interests: user.interests,
        },
        score: calculateMatchScore(currentUser, user),
      }))
      .filter(match => match.score > 0.3) // Only show decent matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return NextResponse.json({ matches: potentialMatches });
  } catch (error) {
    console.error('Match finding error:', error);
    return NextResponse.json(
      { error: 'Failed to find matches' },
      { status: 500 }
    );
  }
}
