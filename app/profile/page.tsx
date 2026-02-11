'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    background: '',
    bio: '',
    location: '',
    dietaryRestrictions: [] as string[],
    budgetMin: '',
    budgetMax: '',
    interests: [] as string[],
    preferredGender: '',
    preferredAgeMin: '',
    preferredAgeMax: '',
    preferredBackground: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load existing profile data
    loadProfile(parsedUser.id);
  }, [router]);

  const loadProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/profile?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const profile = data.user;
        
        setFormData({
          age: profile.age || '',
          gender: profile.gender || '',
          background: profile.background || '',
          bio: profile.bio || '',
          location: profile.location || '',
          dietaryRestrictions: profile.dietaryRestrictions ? JSON.parse(profile.dietaryRestrictions) : [],
          budgetMin: profile.budgetMin || '',
          budgetMax: profile.budgetMax || '',
          interests: profile.interests ? JSON.parse(profile.interests) : [],
          preferredGender: profile.preferredGender || '',
          preferredAgeMin: profile.preferredAgeMin || '',
          preferredAgeMax: profile.preferredAgeMax || '',
          preferredBackground: profile.preferredBackground || '',
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setMessage('Profile updated successfully!');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-orange-600">Complete Your Profile</h1>
            <Link href="/dashboard" className="text-orange-600 hover:text-orange-700">
              Skip for now →
            </Link>
          </div>

          {message && (
            <div className={`p-3 rounded-lg mb-4 ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select...</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                  <input
                    type="text"
                    value={formData.background}
                    onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                    placeholder="e.g., Student, Professional, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Dietary & Budget */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Food Preferences</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                <div className="flex flex-wrap gap-2">
                  {['Vegetarian', 'Vegan', 'Halal', 'No Pork', 'No Beef', 'Gluten-Free'].map(diet => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        dietaryRestrictions: toggleArrayItem(formData.dietaryRestrictions, diet)
                      })}
                      className={`px-4 py-2 rounded-lg border ${
                        formData.dietaryRestrictions.includes(diet)
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Min (SGD)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Max (SGD)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Sports', 'Arts', 'Music', 'Travel', 'Food', 'Books', 'Gaming', 'Fitness', 'Business'].map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      interests: toggleArrayItem(formData.interests, interest)
                    })}
                    className={`px-4 py-2 rounded-lg border ${
                      formData.interests.includes(interest)
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Match Preferences</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Gender</label>
                  <select
                    value={formData.preferredGender}
                    onChange={(e) => setFormData({ ...formData, preferredGender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Any</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Background</label>
                  <input
                    type="text"
                    value={formData.preferredBackground}
                    onChange={(e) => setFormData({ ...formData, preferredBackground: e.target.value })}
                    placeholder="Any or specific (e.g., Student)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Age Min</label>
                  <input
                    type="number"
                    value={formData.preferredAgeMin}
                    onChange={(e) => setFormData({ ...formData, preferredAgeMin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Age Max</label>
                  <input
                    type="number"
                    value={formData.preferredAgeMax}
                    onChange={(e) => setFormData({ ...formData, preferredAgeMax: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 font-semibold"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
