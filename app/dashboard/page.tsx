'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Match {
  user: {
    id: string;
    name: string;
    age: number;
    gender: string;
    location: string;
    bio: string;
    interests: string;
  };
  score: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showMatchDialog, setShowMatchDialog] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadMatches(parsedUser.id);
  }, [router]);

  const loadMatches = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/matches/find?userId=${userId}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (match: Match) => {
    setSelectedMatch(match);
    setShowMatchDialog(true);
  };

  const sendMatchRequest = async () => {
    if (!selectedMatch || !user) return;

    try {
      const response = await fetch('/api/matches/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initiatorId: user.id,
          recipientId: selectedMatch.user.id,
          matchScore: selectedMatch.score,
        }),
      });

      if (response.ok) {
        alert('Match request sent! They will be notified.');
        setShowMatchDialog(false);
        setSelectedMatch(null);
        // Reload matches
        loadMatches(user.id);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send match request');
      }
    } catch (error) {
      console.error('Failed to send match request:', error);
      alert('Failed to send match request');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.6) return 'Good Match';
    return 'Fair Match';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">☕</span>
            <h1 className="text-2xl font-bold text-orange-600">KopiConnect</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.name}!</span>
            <Link href="/profile" className="px-4 py-2 text-orange-600 hover:text-orange-700">
              Edit Profile
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                router.push('/');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Lunch Matches</h2>
          <p className="text-gray-600">
            Here are people who would be great lunch buddies based on your preferences!
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Finding your matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl">🔍</span>
            <h3 className="text-xl font-semibold mt-4 mb-2">No matches found yet</h3>
            <p className="text-gray-600 mb-4">
              Complete your profile to get better matches!
            </p>
            <Link
              href="/profile"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Complete Profile
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const interests = match.user.interests ? JSON.parse(match.user.interests) : [];
              
              return (
                <div key={match.user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{match.user.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {match.user.age && `${match.user.age} years old`}
                        {match.user.age && match.user.gender && ' • '}
                        {match.user.gender}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(match.score)}`}>
                        {Math.round(match.score * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {getScoreLabel(match.score)}
                      </div>
                    </div>
                  </div>

                  {match.user.location && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">📍 {match.user.location}</span>
                    </div>
                  )}

                  {match.user.bio && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{match.user.bio}</p>
                  )}

                  {interests.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {interests.slice(0, 3).map((interest: string) => (
                          <span
                            key={interest}
                            className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                        {interests.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{interests.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleConnect(match)}
                    className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
                  >
                    Connect for Lunch
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Match Dialog */}
      {showMatchDialog && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Send Lunch Request</h3>
            <p className="text-gray-700 mb-4">
              Send a lunch request to <strong>{selectedMatch.user.name}</strong>?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              They'll be notified and can accept or decline your invitation. You can then coordinate the details together.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowMatchDialog(false);
                  setSelectedMatch(null);
                }}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={sendMatchRequest}
                className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
