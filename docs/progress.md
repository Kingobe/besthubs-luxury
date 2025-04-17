# Besthubs Luxury Progress Log

## Completed
- Configured AWS CLI with credentials [2025-04-16].
- Installed dependencies: next-auth@beta, mongodb, @auth/mongodb-adapter, bcryptjs [2025-04-16].
- Fixed MongoDB URI with correct credentials [2025-04-16].
- Set up MongoDB connection (lib/mongodb.js) [2025-04-16].
- Fixed authentication (pages/api/auth/[...nextauth].js) [2025-04-16].
- Moved signup to API route (pages/api/signup.js) to fix 'net' module error [2025-04-16].
- Fixed Payfast notify API directory issue [2025-04-16].
- Created pages: /auth/signin, /auth/signup, /checkout, /admin, /products, /success, /cancel [2025-04-16].
- Updated APIs: /api/products, /api/payfast, /api/payfast/notify [2025-04-16].
- Seeded MongoDB with users and products [2025-04-16].
- Deployed to Vercel [2025-04-16].
- Tested SesNotifier with AWS CLI [2025-04-16].

## Routes
- /auth/signin: User login [2025-04-16].
- /auth/signup: User creation [2025-04-16].
- /checkout: Payfast payment [2025-04-16].
- /admin: Supplier management [2025-04-16].
- /products: Product listings [2025-04-16].
- /success, /cancel: Payfast redirects [2025-04-16].
- /api/signup, /api/products, /api/payfast, /api/payfast/notify: Backend APIs [2025-04-16].

## Decisions
- Switched to MongoDB to avoid AWS signature issues [2025-04-16].
- Used next-auth@beta for Next.js 15.3.0 compatibility [2025-04-16].
- Moved MongoDB operations to API routes to fix 'net' module error [2025-04-16].
