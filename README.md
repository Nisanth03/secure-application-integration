# Secure Application Integration

A full-stack internship application platform built with React, Node.js, Express and SQLite.

## Features

- Internship listings loaded from a backend API
- Search internships
- Filter by domain
- Filter by work mode
- Loading state
- Empty state
- API failure state with retry
- Internship application form
- Client-side validation
- Server-side validation
- Duplicate application protection
- Portfolio URL validation
- Secure HTTP headers with Helmet
- API rate limiting
- Parameterized SQL queries
- Automated API tests with Vitest and Supertest
- SQLite database

## Tech Stack

### Frontend
- React
- Vite

### Backend
- Node.js
- Express
- SQLite
- better-sqlite3

### Security
- Helmet
- express-rate-limit
- Parameterized SQL queries
- Server-side validation

### Testing
- Vitest
- Supertest

## Project Structure

```text
Internship board 3
├── frontend
│   ├── src
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── routes
│   │   ├── app.js
│   │   ├── db.js
│   │   ├── seed.js
│   │   └── server.js
│   ├── tests
│   ├── data
│   │   └── internships.json
│   └── package.json
│
├── .gitignore
└── README.md