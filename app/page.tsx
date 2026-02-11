import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">☕</span>
            <h1 className="text-2xl font-bold text-orange-600">KopiConnect</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-4 py-2 text-orange-600 hover:text-orange-700">
              Login
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Lunch Buddy in Singapore
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with like-minded people for a casual lunch at Singapore's best food courts. 
            Low-cost, non-intimidating, and perfect for making new friends!
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-orange-600 text-white text-lg font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-600">
              AI-powered algorithm matches you based on proximity, time availability, dietary needs, budget, and interests.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🍜</div>
            <h3 className="text-xl font-semibold mb-2">Food Court Focus</h3>
            <p className="text-gray-600">
              Meet at Singapore's vibrant food courts for an affordable and relaxed dining experience.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Safe & Easy</h3>
            <p className="text-gray-600">
              Set your preferences for age, background, and gender. Connect at your own pace.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h4 className="font-semibold mb-2">Create Profile</h4>
              <p className="text-sm text-gray-600">Set your preferences and availability</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h4 className="font-semibold mb-2">Get Matched</h4>
              <p className="text-sm text-gray-600">AI finds compatible lunch buddies</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h4 className="font-semibold mb-2">Connect</h4>
              <p className="text-sm text-gray-600">Plan your lunch meeting</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h4 className="font-semibold mb-2">Share Feedback</h4>
              <p className="text-sm text-gray-600">Help improve future matches</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-20 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; 2026 KopiConnect. Making lunch connections easy in Singapore.</p>
        </div>
      </footer>
    </div>
  );
}
