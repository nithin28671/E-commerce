# E-Commerce Platform

A complete, production-ready e-commerce platform built with the MERN stack.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + httpOnly cookies
- **Payment**: Stripe
- **Image Storage**: Cloudinary
- **Email**: SendGrid
- **Caching**: Redis

## Features

- 🛒 Shopping cart with persistent storage
- 🔐 Secure user authentication & authorization
- 📱 Fully responsive design
- 🔍 Advanced product search & filtering
- ⭐ Product rating & review system
- 💳 Payment processing with Stripe
- 📧 Email notifications
- 🛍️ Wishlist functionality
- 📊 Admin dashboard
- 🚀 Performance optimized
- 🔒 Enterprise-grade security

## Project Structure

```
ecommerce-platform/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Node.js + Express + TypeScript
├── shared/            # Shared types and utilities
├── docs/              # API documentation
└── docker-compose.yml # Development environment
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster
- Redis instance
- Stripe account
- Cloudinary account
- SendGrid account

### Installation

1. Clone the repository
2. Set up environment variables
3. Install dependencies
4. Run the development servers

```bash
# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup
cd backend
npm install
npm run dev
```

## Environment Variables

See the documentation in each directory for required environment variables.

## Documentation

- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guide](./docs/contributing.md)

## License

MIT License