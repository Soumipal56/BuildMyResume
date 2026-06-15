# AI Resume Builder

An intelligent, full-stack web application designed to help users create professional resumes effortlessly with the power of AI. Built with Next.js, React, Tailwind CSS, and Google GenAI.

## Features

- **AI-Powered Assistance**: Leverage Google GenAI to generate and refine resume content.
- **Modern UI**: A responsive, beautiful interface built with Tailwind CSS v4 and React 19.
- **User Authentication**: Secure user login and registration using JWT and Bcrypt.
- **Database**: Store user data and resume drafts safely with MongoDB and Mongoose.
- **PDF Export**: Instantly export your resume to a professional PDF format using `html2pdf.js`.
- **Form Handling**: Smooth and performant form validation using `react-hook-form`.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Frontend**: React 19, Tailwind CSS v4
- **Backend/API**: Next.js API Routes, Google GenAI SDK
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, Bcrypt
- **Utilities**: `html2pdf.js` for PDF generation, `react-hook-form` for form state.

## Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB instance (local or Atlas)
- Google Gemini API Key

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd resume-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables (based on project setup):
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Next.js App Router pages and layouts.
- `/src/apis` - Backend API routes handling authentication, DB interactions, and AI generation.
- `/src/components` - Reusable React components.
- `/src/models` - Mongoose database schemas.
- `/src/middlewares` - Custom middleware functions (e.g., auth protection).
- `/src/lib` - Utility functions and database connection logic.
- `/src/types` - TypeScript type definitions.
