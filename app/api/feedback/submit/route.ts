import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      matchId,
      userId,
      rating,
      comment,
      wasHelpful,
      willMeetAgain,
    } = body;

    if (!matchId || !userId || !rating) {
      return NextResponse.json(
        { error: 'Match ID, user ID, and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if feedback already exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: {
        matchId_userId: {
          matchId,
          userId,
        },
      },
    });

    if (existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback already submitted' },
        { status: 400 }
      );
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        matchId,
        userId,
        rating: parseInt(rating),
        comment: comment || null,
        wasHelpful: wasHelpful ?? null,
        willMeetAgain: willMeetAgain ?? null,
      },
    });

    // Update match status to completed
    await prisma.match.update({
      where: { id: matchId },
      data: { status: 'completed' },
    });

    return NextResponse.json({ feedback }, { status: 201 });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
