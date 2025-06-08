# AI Foundations LMS

A comprehensive Learning Management System for AI Foundations courses built with React and Supabase.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Environment Setup

1. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

### Step 3: Link your project

```bash
supabase link --project-ref your-project-ref
```

### Step 4: Apply migrations

```bash
supabase db push
```

This will create all necessary tables including:
- courses
- modules 
- lessons
- user_progress
- coupons
- profiles (created automatically by Supabase Auth)

### Step 5: Verify tables exist

You can verify the tables were created by running:

```bash
supabase db inspect
```

Or check in your Supabase Dashboard under "Table Editor".

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ai_foundations_lms
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Features

- **Authentication**: Email/password, social logins, phone authentication
- **Course Management**: Create, edit, and manage courses, modules, and lessons
- **User Progress Tracking**: Track completion status and XP progression
- **Admin Dashboard**: Comprehensive admin interface for content management
- **User Dashboard**: Personal learning dashboard with progress visualization
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
├── pages/              # Main application pages
├── lib/                # Utility libraries (Supabase client)
├── styles/             # Global styles and Tailwind config
└── utils/              # Helper functions

supabase/
├── migrations/         # Database migration files
└── functions/          # Edge functions (if any)
```

## Troubleshooting

### "relation 'public.courses' does not exist" Error

This error occurs when the database migrations haven't been applied. Follow these steps:

1. Ensure you have the Supabase CLI installed and are logged in
2. Link your project: `supabase link --project-ref your-project-ref`
3. Apply migrations: `supabase db push`
4. Verify tables exist in your Supabase Dashboard

### Environment Variables Not Found

Make sure your `.env` file is in the root directory and contains:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### RLS (Row Level Security) Issues

If you're having permission issues:
1. Check that RLS policies are correctly applied
2. Ensure users have proper roles and permissions
3. Verify authentication is working correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details