# Setup Instructions for KopiConnect

## Initial Setup

If you're experiencing "Failed to register user" errors, follow these steps:

### 1. Create Environment File

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

The `.env` file should contain:
```
DATABASE_URL="file:./dev.db"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

This creates the Prisma client that the application uses to interact with the database.

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates the SQLite database and all necessary tables.

### 5. Start the Development Server

```bash
npm run dev
```

## Troubleshooting

### "Failed to register user" Error

This error typically occurs when:
- The database hasn't been initialized
- Prisma client hasn't been generated
- The `.env` file is missing

**Solution**: Follow steps 1-4 above.

### Database Connection Errors

If you see database connection errors:
1. Check that `prisma/dev.db` exists
2. Delete `prisma/dev.db` and run `npx prisma migrate dev` again
3. Ensure the `.env` file has the correct `DATABASE_URL`

### Prisma Client Errors

If you see "PrismaClient" errors:
```bash
npx prisma generate
```

## Verifying Your Setup

You can verify the database is set up correctly:

```bash
npx prisma studio
```

This opens a GUI to view your database. You should see the User, Availability, Match, Feedback, and FoodCourt tables.