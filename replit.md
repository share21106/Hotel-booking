Overview
This is a full-stack web application built with React (frontend) and Express.js (backend) that appears to be a travel accommodation sharing platform. The application allows users to create trips, share accommodation costs with other travelers, and book shared accommodations together. It features a modern UI built with shadcn/ui components and uses PostgreSQL with Drizzle ORM for data persistence.

User Preferences
Preferred communication style: Simple, everyday language.

System Architecture
Frontend Architecture
Framework: React 18 with TypeScript
Build Tool: Vite for fast development and optimized production builds
Routing: Wouter for client-side routing
State Management: TanStack Query (React Query) for server state management
UI Components: shadcn/ui component library built on Radix UI primitives
Styling: Tailwind CSS with custom design tokens and CSS variables
Form Handling: React Hook Form with Zod validation via @hookform/resolvers
Backend Architecture
Framework: Express.js with TypeScript
Runtime: Node.js with ES modules
Development: tsx for TypeScript execution in development
Build Process: esbuild for production bundling
API Design: RESTful API with /api prefix for all endpoints
Middleware: Custom logging middleware for API request tracking
Data Storage
Database: PostgreSQL (configured for Neon Database)
ORM: Drizzle ORM for type-safe database operations
Schema: Centralized schema definition in shared/schema.ts
Migrations: Drizzle Kit for database schema migrations
Connection: @neondatabase/serverless for serverless PostgreSQL connections
Development Architecture
Monorepo Structure: Client and server code in separate directories with shared types
Path Aliases: TypeScript path mapping for clean imports (@/, @shared/)
Hot Reload: Vite HMR for frontend, tsx watch mode for backend
Type Safety: Strict TypeScript configuration across all packages
Storage Layer
Interface: IStorage interface for abstraction
Implementation: MemStorage class for in-memory development storage
User Management: Basic user CRUD operations with username/password authentication
Data Models: Drizzle-generated types with Zod validation schemas
External Dependencies
Database & ORM
PostgreSQL: Primary database (Neon Database serverless)
Drizzle ORM: Type-safe database toolkit
Drizzle Kit: Database migration and introspection tool
UI & Styling
Radix UI: Headless component primitives for accessibility
Tailwind CSS: Utility-first CSS framework
shadcn/ui: Pre-built component library
Lucide React: Icon library
class-variance-authority: Utility for component variants
State Management & Data Fetching
TanStack Query: Server state management and caching
React Hook Form: Form state management
Zod: Runtime type validation
Development Tools
Vite: Frontend build tool and dev server
esbuild: Fast JavaScript bundler for production
tsx: TypeScript execution for Node.js
PostCSS: CSS processing with Autoprefixer
Routing & Navigation
Wouter: Lightweight client-side router
Utilities
date-fns: Date manipulation library
clsx: Conditional className utility
nanoid: Unique ID generation
cmdk: Command palette component