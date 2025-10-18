# AI Agent Instructions for doutor-agenda

This document provides essential context for AI agents working with the doutor-agenda codebase.

## Project Overview

doutor-agenda is a Next.js application for managing medical clinic appointments. It uses:

- Next.js 15.3 with App Router
- TypeScript
- Drizzle ORM with PostgreSQL
- TailwindCSS for styling
- React 19

## Key Architecture Patterns

### Database Schema Structure

The database schema (`src/db/schema.ts`) defines the core domain model:

- Clinics can have many doctors and patients
- Users can be associated with multiple clinics through a many-to-many relationship
- Appointments link patients, doctors, and clinics
- All tables include `createdAt` and `updatedAt` timestamps
- Relations are explicitly defined using Drizzle's relations API

### Data Layer

- Database interactions use Drizzle ORM
- Connection is configured in `src/db/index.ts`
- Environment variable `DATABASE_URL` must be set for database access

## Development Workflow

### Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment:

- Copy `.env.example` to `.env`
- Configure `DATABASE_URL` for PostgreSQL connection

3. Start development server:

```bash
npm run dev
```

### Code Organization

- `/src/app/*` - Next.js App Router pages and layouts
- `/src/db/*` - Database schema and configuration
- `/src/lib/*` - Shared utilities

### Code Style

- Uses ESLint with Next.js defaults plus simple-import-sort plugin
- Prettier for formatting with tailwindcss plugin
- TypeScript strict mode enabled

## Key Integration Points

### Database

- All database operations should use Drizzle ORM
- Tables use UUID primary keys
- Cascading deletes configured for clinic-related records

### UI Components

- Uses TailwindCSS with class-variance-authority for variants
- Lucide React for icons
- Uses clsx and tailwind-merge for class name management

## Common Tasks

### Adding New Database Tables

1. Define table in `src/db/schema.ts`
2. Define relations with existing tables
3. Run Drizzle migrations (TODO: Add migration commands)

### Working with Dates/Times

- All timestamps stored in UTC
- Doctor availability uses integer weekdays (0-6) and time fields
