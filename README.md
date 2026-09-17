# Primary School Management System

A complete, modern, responsive school management system built with Next.js, Prisma, MySQL, and Tailwind CSS.

## Features

- **User Authentication** - Role-based access (Admin, Head Teacher, Teacher, Bursar, Parent)
- **Pupil Management** - Registration, profiles, search, filter
- **Class Management** - Classes and streams
- **Teacher Management** - Staff profiles and assignments
- **Attendance** - Daily marking with statistics
- **School Fees** - Payment tracking with receipts
- **Marks & Exams** - Grade entry and calculations
- **Report Cards** - Auto-generated printable report cards
- **Announcements** - School-wide messaging
- **Reports** - Various analytics and exports
- **Dark/Light Mode** - Theme toggle
- **Responsive Design** - Works on desktop, tablet, and mobile

## Setup Instructions

### Prerequisites

- Node.js 18+
- MySQL/MariaDB (via XAMPP/Laragon or standalone)
- npm

### 1. Install Dependencies

```bash
cd school-management
npm install
```

### 2. Setup Database

Make sure MySQL is running (XAMPP/Laragon), then:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with demo data
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update:

```
DATABASE_URL="mysql://root:@localhost:3306/school_management"
JWT_SECRET="your-secret-key-here"
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | admin123 |
| Teacher | teacher@school.com | teacher123 |
| Parent | parent@school.com | parent123 |
| Bursar | bursar@school.com | bursar123 |

## Deployment on Vercel

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Use a cloud MySQL provider (PlanetScale, TiDB, etc.)
5. Update `DATABASE_URL` to cloud database URL
6. Deploy!

## Project Structure

```
school-management/
├── prisma/          # Database schema and seed
├── src/
│   ├── app/         # Next.js App Router pages
│   │   ├── api/     # API routes
│   │   ├── (auth)/  # Login page
│   │   ├── (dashboard)/ # Admin dashboard pages
│   │   └── (parent)/    # Parent portal
│   ├── components/  # UI and layout components
│   └── lib/         # Utilities, auth, validation
└── public/          # Static assets
```

## Technology Stack

- **Frontend:** Next.js 15, React, Tailwind CSS, Recharts
- **Backend:** Next.js API Routes (Serverless)
- **Database:** MySQL via Prisma ORM
- **Auth:** JWT with bcryptjs
- **Validation:** Zod
- **Deployment:** Vercel
