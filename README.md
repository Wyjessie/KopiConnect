# KopiConnect

KopiConnect is a lunch buddy matching platform designed for Singapore, helping people connect over casual meals at local food courts. The platform uses AI-powered matching algorithms to pair users based on multiple criteria including proximity, time availability, dietary restrictions, budget, age, and common interests.

## 🌟 Features

### Smart Matching Algorithm
- **Multi-criteria matching**: Considers proximity, time availability, dietary restrictions, budget, age, and interests
- **Weighted scoring system**: Customizable weights for different matching criteria
- **AI-based optimization**: Learning from user feedback to improve future matches
- **Preference filtering**: Hard filters for gender, background, and age preferences

### User Preferences
- Set dietary restrictions (Vegetarian, Vegan, Halal, No Pork, No Beef, Gluten-Free)
- Define budget range for meals
- Select interests from multiple categories
- Specify preferred match characteristics (age range, gender, background)
- Set location preferences across Singapore regions (North, South, East, West, Central)

### Matching System
- View potential matches with compatibility scores
- Send lunch requests to compatible users
- Accept or decline incoming match requests
- Provide feedback after meeting to improve future matches

### User Experience
- Clean, modern UI with Singapore-themed design (Kopi/coffee motif)
- Mobile-responsive layout
- Simple registration and profile setup
- Dashboard showing personalized matches

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Wyjessie/KopiConnect.git
cd KopiConnect
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: Custom implementation with bcrypt
- **State Management**: React hooks and localStorage

## 📁 Project Structure

```
KopiConnect/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── users/        # User profile management
│   │   ├── matches/      # Matching and connection endpoints
│   │   └── feedback/     # Feedback submission
│   ├── auth/             # Auth pages (login, register)
│   ├── dashboard/        # Main dashboard
│   ├── profile/          # Profile management page
│   └── page.tsx          # Landing page
├── lib/
│   ├── prisma.ts         # Prisma client setup
│   └── matching.ts       # Matching algorithm implementation
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## 🎯 Matching Algorithm

The matching algorithm uses a weighted scoring system:

- **Proximity** (25%): Same or nearby Singapore region
- **Time Availability** (20%): Overlapping available times
- **Dietary Compatibility** (15%): Compatible dietary restrictions
- **Budget Compatibility** (15%): Overlapping budget ranges
- **Age Compatibility** (10%): Age proximity and preference matching
- **Common Interests** (15%): Shared hobbies and interests

### AI Learning
The system can adjust matching weights based on user feedback:
- Collects ratings after each lunch meeting
- Analyzes successful vs unsuccessful matches
- Optimizes weights to improve future match quality

## 🔒 Security

- Passwords are hashed using bcrypt
- Input validation on all API endpoints
- SQL injection prevention through Prisma ORM
- Client-side session management (production would use secure session tokens)

## 🌏 Singapore Focus

The platform is specifically designed for Singapore:
- Location options based on Singapore regions
- Budget range in SGD
- Food court-centric meeting culture
- Dietary options relevant to Singapore (Halal, etc.)

## 🚧 Future Enhancements

- Real-time chat/messaging between matched users
- Food court location database with ratings and reviews
- Calendar integration for scheduling
- Push notifications for match requests
- Photo uploads for profiles
- Group lunch matching
- Social media integration
- Advanced AI recommendations using machine learning

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### User Management
- `GET /api/users/profile?userId={id}` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Matching
- `GET /api/matches/find?userId={id}` - Find potential matches
- `POST /api/matches/create` - Create match request
- `POST /api/matches/respond` - Accept/reject match request

### Feedback
- `POST /api/feedback/submit` - Submit feedback after meeting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👥 About

KopiConnect was built to help people in Singapore make meaningful connections over food - a fundamental part of Singaporean culture. Whether you're new to the city, looking to expand your social circle, or just want to try new food with interesting people, KopiConnect makes it easy and accessible.

---

**Note**: This is a demonstration project. For production use, implement proper authentication, security measures, and infrastructure scaling.
