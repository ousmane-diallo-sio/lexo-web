# Lexo Web - Back Office Documentation

## Overview

The Lexo Web Back Office is a comprehensive management system for the Lexo educational platform. It provides CRUD operations for all platform entities with role-based access control.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/User)
- Google OAuth integration
- Self-deletion prevention for users

### 📊 Entity Management
The system provides full CRUD operations for:

1. **Users** (`/entities/users`)
   - Email, first name, last name
   - Admin privileges management
   - Password management (optional updates)
   - Google ID integration
   - ⚠️ **Self-deletion prevention**: Users cannot delete their own accounts

2. **Child Users** (`/entities/child-users`)
   - Parent-child relationships
   - Birth date tracking
   - Avatar management
   - Level progression tracking

3. **Letter Exercises** (`/entities/letter-exercises`)
   - Letter-to-word associations
   - Word images
   - Age range targeting
   - XP point system

4. **Animal Exercises** (`/entities/animal-exercises`)
   - Animal names and images
   - Sound file management
   - Educational content for children

5. **Number Exercises** (`/entities/number-exercises`)
   - Number recognition
   - Visual representations
   - Progressive difficulty

6. **Color Exercises** (`/entities/color-exercises`)
   - Color names and hex codes
   - Visual color representations
   - Image associations

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Clean, intuitive interface
- Real-time data updates with TanStack Query
- Toast notifications for user feedback
- Loading states and error handling

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **React Router** for navigation
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for styling
- **Zod** for validation
- **Bun** as package manager and bundler

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   └── ui/              # UI primitives
├── config/
│   └── entities/        # Entity configurations
├── contexts/            # React contexts (Auth)
├── hooks/               # Custom React hooks
├── lib/
│   ├── api/            # API client setup
│   ├── utils/          # Utility functions
│   └── validators/     # Validation schemas
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard page
│   ├── privacy/        # Privacy policy
│   └── users/          # User management
└── types/              # TypeScript type definitions
```

### Key Components

#### EntityPage
Generic CRUD interface that works with any entity type through configuration:
```typescript
<EntityPage config={userEntityConfig} />
```

#### EntityForm
Dynamic form generator based on field configurations:
- Supports multiple input types (text, email, password, date, boolean, textarea)
- Built-in validation
- Handles create/edit modes

#### Entity Configurations
Each entity has a configuration file defining:
- API endpoints
- Form fields and validation
- Table columns
- Available actions (create, edit, delete, view)
- Conditional logic (e.g., delete restrictions)

## API Integration

### Endpoints Structure
- **Users**: `/api/users`
- **Child Users**: `/api/child-users`
- **Letter Exercises**: `/api/exercises/letter`
- **Animal Exercises**: `/api/exercises/animal`
- **Number Exercises**: `/api/exercises/number`
- **Color Exercises**: `/api/exercises/color`

### Authentication
All API requests include JWT tokens in Authorization headers:
```
Authorization: Bearer <jwt_token>
```

### Data Transfer Objects (DTOs)
Comprehensive DTOs for all operations:
- `CreateUserDTO`, `UpdateUserDTO`
- `CreateChildUserDTO`, `UpdateChildUserDTO`
- Exercise-specific DTOs for each type

## Security Features

### Self-Deletion Prevention
Users cannot delete their own accounts. This is enforced at multiple levels:

1. **Frontend**: Conditional delete button in entity configurations
2. **UI**: Delete button disabled for current user
3. **API**: Server-side validation (recommended)

Implementation in `users.tsx` config:
```typescript
delete: {
  enabled: true,
  condition: (item: User, currentUser?: User) => {
    return item.id !== currentUser?.id;
  }
}
```

### Role-Based Access Control
- Admin users can access all entities
- Regular users have restricted access
- Dashboard shows different content based on user role

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Access to Lexo API

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd lexo-web

# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun build
```

### Environment Variables
Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Usage

### Dashboard
Navigate to `/dashboard` to see the main interface with cards for each entity type.

### Entity Management
1. Click on any entity card from the dashboard
2. View, create, edit, or delete records
3. Use search and filtering capabilities
4. Enjoy real-time updates

### User Management
- Admins can manage all users
- Self-deletion is automatically prevented
- Password updates are optional (leave empty to keep current)

## Development

### Adding New Entities
1. Define TypeScript interface in `types/index.ts`
2. Create entity configuration in `config/entities/`
3. Add route in `App.tsx`
4. Add navigation card in `DashboardPage.tsx`

### Customizing Forms
Entity configurations support:
- Field types: text, email, password, date, boolean, textarea, select
- Validation: required, min/max length, patterns
- Readonly fields
- Custom placeholders

### API Client
The API client (`lib/api/client.ts`) handles:
- Authentication headers
- Error handling
- Request/response transformation

## Contributing

1. Follow TypeScript best practices
2. Use existing UI components when possible
3. Add proper error handling
4. Include validation for all forms
5. Update documentation for new features

## License

This project is part of the Lexo educational platform.
