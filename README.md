# Event Ticket Booking System

## Introduction
This project is a **Node.js-based Event Ticket Booking System** that allows users to book event tickets, manage a waiting list when tickets are sold out, and handle cancellations efficiently. It follows **Test-Driven Development (TDD)** principles and ensures concurrency safety.

## Features
- Initialize an event with available tickets.
- Book tickets concurrently while avoiding race conditions.
- Implement a **waiting list** when tickets are sold out.
- Handle ticket **cancellations** and auto-assign them to waiting list users.
- **RESTful API design** using Express.js.
- **Authentication** for protected routes.
- **Error handling** for edge cases.
- **Database management** using migrations.
- **80%+ test coverage** with unit and integration tests.

## Technologies Used
- **Node.js & Express.js** - Server and API framework.
- **PostgreSQL/MySQL** - Relational database for order storage.
- **Sequelize** - ORM for database interactions.
- **Jest & Supertest** - For testing API endpoints.
- **Express Validator** - Request validation middleware.
- **JWT/Basic Authentication** - Secure API authentication.
- **Rate Limiting & Logging** - For security and tracking.

## Installation
### Prerequisites
Ensure you have **Node.js (>=16)** installed.

### Clone the Repository
```sh
git clone https://github.com/Praiseike/backend-assessment.git
cd backend-assessment
```

### Install Dependencies
```sh
npm install
```

### Configure Environment Variables
Create a `.env` file with the following:
```env
JWT_SECRET=aweirdrandomstring
```

### Run Database Migrations
```sh
npx test -- --coverage
```

### Start the Server
```sh
npm start
```

## API Endpoints

### **1. Initialize an Event**
```http
POST /initialize
```
**Request Body:**
```json
{
  "event_name": "Tech Conference 2025",
  "available_tickets": 7
}
```
**Response:**
```json
{
  "message": "Event created successfully",
  "eventd": 1
}
```

### **2. Book a Ticket**
```http
POST /book
```
**Request Body:**
```json
{
  "event_id": 1,
}
```
**Responses:**
- `201 Created`: Ticket successfully booked.
- `202 Accepted`: Tickets sold out, user added to waiting list.
- `409 Conflict`: User already booked a ticket.

### **3. Cancel a Booking**
```http
POST /cancel
```
**Request Body:**
```json
{
  "event_id": 1,
}
```
**Response:**
```json
{
    "error": false,
    "message": "Booking canceled successfully."
}
```

### **4. Get Event Status**
```http
GET /status/:eventId
```
**Response:**
```json
{
    "error": false,
    "message": "Fetched event",
    "data": {
        "name": "Text event",
        "available_tickets": 0,
        "waiting_list_count": 1,
        "bookings_count": 1
    }
}
```

## Running Tests
Run all tests to verify core functionalities:
```sh
npm test
```

## Project Structure
```

📦 event-ticket-booking
├── config
├── tests
├── coverage
├── seeders
├── src
│   ├── app.js
│   ├── utils        # Helpers and utility functions
│   ├── validators   # Request validators
│   ├── controllers  # API controllers
│   ├── models       # Database models (Prisma)
│   ├── middlewares  # Middleware functions
│   └── routes       # API routes
├── migrations
├── models
├── .env
├── README.md
├── index.js
├── package-lock.json
├── sqlite.db        # Sqlite Database
└── package.json

```

## Security Enhancements
- ✅ **JWT Authentication** for user authentication.
- ✅ **Rate Limiting** to prevent abuse.
- ✅ **Input Validation** using Express Validator.
- ✅ **Error Handling** for robust API responses.
