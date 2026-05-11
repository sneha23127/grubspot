# GrubSpot

GrubSpot is a comprehensive Mess Finder and Management application designed to bridge the gap between mess owners and students/professionals looking for daily meal services. 

## Features

- **Multi-Role Authentication**: Secure login and signup for Regular Users, Mess Owners, and Administrators.
- **User Dashboard**: Discover nearby messes, view daily menus, manage subscriptions (pause, resume, cancel), and submit reviews or complaints.
- **Mess Owner Panel**: Comprehensive tools to manage daily menus, update pricing, configure subscription plans, and toggle home delivery options.
- **Admin Dashboard**: Centralized control panel for managing users and mess owners, resolving support tickets, and monitoring platform financials.
- **Real-Time Data**: Dynamic updates for menus and subscription statuses.

## Tech Stack

### Frontend
- **React.js**: UI Library (v19)
- **Vite**: Frontend Build Tool
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests

### Backend
- **Node.js & Express.js**: REST API Framework
- **PostgreSQL**: Relational Database
- **bcryptjs**: Password hashing and secure authentication

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sneha23127/grubspot.git
   cd grubspot
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database for GrubSpot.
   - Configure the environment variables in the `backend` directory.

4. Start the development servers:

   **Backend**:
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## Project Structure

- `/frontend`: Contains the React application, UI components, pages (Login, Home, MessDetail, etc.), and routing.
- `/backend`: Contains the Express server, database configuration, routes, and authentication logic.

## License
ISC
