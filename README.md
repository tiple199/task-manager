# Task Manager Backend

## Project description
Task Manager Backend is a RESTful API for user authentication and task management.
The system supports:
- Register and login with JWT authentication.
- User profile retrieval.
- CRUD operations for tasks.
- Task filtering, searching, and pagination.

All endpoints are prefixed with `/api`.

## Tech stack
- Node.js
- TypeScript
- Express.js
- Prisma ORM
- MySQL (via `DATABASE_URL`)
- JWT (`jsonwebtoken`)
- Zod (request validation)
- Bcrypt (password hashing)

## API list
Base URL (local): `http://localhost:3000/api`

### Auth
- `POST /register` - Register a new user
- `POST /login` - Login and receive access token

### User
- `GET /profile` - Get current user profile (requires Bearer token)

### Task
- `GET /tasks` - Get all tasks of current user (requires Bearer token)
  - Query params: `status`, `priority`, `search`, `page`, `limit`
- `POST /tasks` - Create task (requires Bearer token)
- `GET /tasks/:id` - Get task by id (requires Bearer token)
- `PUT /tasks/:id` - Update task by id (requires Bearer token)
- `DELETE /tasks/:id` - Delete task by id (requires Bearer token)

Authorization header format:
`Authorization: Bearer <accessToken>`

## How to run
1. Install dependencies:

```bash
npm install
```

2. Create `.env` file in project root:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB_NAME"
JWT_SECRET="your_jwt_secret"
PORT=3000
```

3. Run Prisma migration:

```bash
npx prisma migrate dev
```

4. Start development server:

```bash
npm run dev
```

5. Build and run production:

```bash
npm run build
npm run start
```
