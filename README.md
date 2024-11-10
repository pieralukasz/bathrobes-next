# Next.js with Supabase and Drizzle

This project is a modern web application built with Next.js, Supabase, and Drizzle ORM. It features a robust authentication system and a product catalog.

## Features

- **TypeScript**: Fully typed for better developer experience and code reliability.
- **Next.js App Router**: Utilizes the latest Next.js features for efficient routing and rendering.
- **Supabase Authentication**: Implements a secure sign-in system using Supabase.
- **Drizzle ORM**: Integrates Drizzle for database operations with PostgreSQL.
- **Tailwind CSS**: Styled with Tailwind CSS for a responsive and customizable UI.
- **shadcn/ui Components**: Incorporates shadcn/ui for pre-built, customizable React components.

## Getting Started

### Prerequisites

- Node.js (version specified in your package.json)
- PostgreSQL database (Supabase)

### Installation

1. Clone the repository:
   git clone https://github.com/pieralukasz/bathrobes-next.git cd bathrobes-next

2. Install dependencies:
   npm install

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   DATABASE_URL=[your-supabase-database-url] (or it doesn't matter if supabase, just use postgresql url)

4. Run the development server:
   npm run dev

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `src/`: Contains the main source code
- `features/`: Feature-based code organization
- `lib/`: Utility functions and shared code
- `server/`: Server-side code including database schema

## Database

This project uses Drizzle ORM with a PostgreSQL database. The database schema is defined in `src/server/db/schema.ts`.
