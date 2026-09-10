# B2B RFQ Marketplace

A full-stack B2B Request for Quotation (RFQ) marketplace that connects buyers with suppliers.

Buyers can create RFQs for products or services, while suppliers can discover relevant RFQs and submit quotations. The application includes role-based authentication, persistent PostgreSQL storage, input validation, and a responsive web interface.

## Developer

**Harsha Vardhan Gudla**

Software Developer | Full-Stack Development

- GitHub: https://github.com/harshavardhangudla
- LeetCode: https://leetcode.com/u/harshavardhan_gudla/
- LinkedIn: https://www.linkedin.com/in/harsha-vardhan-gudla/

---

## Live Application

https://frontend-ten-chi-4dyrsecqit.vercel.app

## GitHub Repository

https://github.com/harshavardhangudla/rfq-marketplace

---

## Features

### Buyer

- Register and log in as a Buyer
- Create RFQs
- Specify:
  - Product/service name
  - Description
  - Quantity
  - Delivery location
  - Submission deadline
- View created RFQs
- Edit and manage own RFQs
- View quotations received from suppliers

### Supplier

- Register and log in as a Supplier
- Browse available RFQs
- Search RFQs by product/service and delivery location
- View RFQ details
- Submit quotations with:
  - Quoted price
  - Estimated delivery time
  - Message/notes
- View submitted quotations

### Authentication & Security

- JWT-based authentication
- Password hashing using bcrypt
- Role-based authorization for Buyer and Supplier actions
- Protected backend routes
- Request validation using Zod
- Environment variables for sensitive configuration
- Database-level uniqueness constraints

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- Zod
- JWT
- bcrypt

### Database

- PostgreSQL
- Neon PostgreSQL
- Prisma ORM

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: Neon

---

## Architecture

The application follows a simple client-server architecture:

```text
┌──────────────────────┐
│      React + Vite    │
│      Frontend        │
└──────────┬───────────┘
           │
           │ REST API
           ▼
┌──────────────────────┐
│   Node.js + Express  │
│      Backend         │
│                      │
│ JWT Authentication   │
│ Role Authorization   │
│ Zod Validation       │
└──────────┬───────────┘
           │
           │ Prisma ORM
           ▼
┌──────────────────────┐
│      PostgreSQL      │
│        Neon          │
└──────────────────────┘
```

---

## Database Design

The application uses three main models.

### User

Stores buyer and supplier accounts.

- `id`
- `name`
- `email`
- `password`
- `role`
- `createdAt`
- `updatedAt`

Roles:

- `BUYER`
- `SUPPLIER`

### RFQ

Stores requests created by buyers.

- `id`
- `productName`
- `description`
- `quantity`
- `deliveryLocation`
- `deadline`
- `buyerId`
- `createdAt`
- `updatedAt`

Each RFQ belongs to one Buyer and can receive multiple quotations.

### Quotation

Stores supplier quotations for RFQs.

- `id`
- `quotedPrice`
- `deliveryTime`
- `message`
- `rfqId`
- `supplierId`
- `createdAt`

A supplier can submit only one quotation for a particular RFQ.

---

## Database Relationships

```text
User (Buyer)
    │
    │ creates
    ▼
   RFQ
    │
    │ receives
    ▼
Quotation
    ▲
    │ submitted by
    │
User (Supplier)
```

---

## API Overview

The backend exposes REST APIs for the following operations.

### Authentication

- User registration
- User login
- JWT authentication

### RFQs

- Create RFQ
- View buyer's RFQs
- Update RFQ
- Delete/manage RFQ
- Browse RFQs as a supplier
- Search/filter RFQs
- View RFQ details

### Quotations

- Submit quotation
- View quotations received by a buyer
- View quotations submitted by a supplier

Protected operations require authentication and appropriate role authorization.

---

## Project Structure

```text
rfq-marketplace/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── ...
│   │
│   ├── prisma.config.ts
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── BuyerDashboard.jsx
│   │   │   ├── BuyerRFQDetails.jsx
│   │   │   ├── CreateRFQ.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SupplierDashboard.jsx
│   │   │   └── SupplierRFQDetails.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── vercel.json
│   └── package.json
│
└── README.md
```

---

## Local Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL database or a hosted PostgreSQL provider

### 1. Clone the Repository

```bash
git clone https://github.com/harshavardhangudla/rfq-marketplace.git
cd rfq-marketplace
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret"
PORT=5000
```

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm start
```

The backend will run locally on:

```text
http://localhost:5000
```

### 3. Setup the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on the local Vite development server.

---

## Environment Variables

The backend requires the following environment variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL database connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `PORT` | Backend server port |

Sensitive environment variables are not committed to the repository.

---

## Authentication Flow

1. User registers as either Buyer or Supplier.
2. The password is securely hashed using bcrypt before being stored.
3. User logs in using email and password.
4. The backend verifies the credentials.
5. A JWT token is generated after successful login.
6. Protected API requests use the JWT token.
7. Backend middleware verifies the token and checks the user's role before allowing protected operations.

---

## Validation & Error Handling

The backend validates incoming request data using Zod.

Validation covers important fields such as:

- Required fields
- Valid email format
- Positive quantity
- Valid quotation price
- Required RFQ information
- Valid deadlines

The application handles common errors such as:

- Invalid credentials
- Unauthorized requests
- Access to resources belonging to another user
- Duplicate quotations
- Missing RFQs
- Invalid request data

The frontend also provides loading, empty, and error states where appropriate.

---

## Deployment

The application is deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon PostgreSQL

The frontend communicates with the deployed Express backend through REST APIs.

### Production URLs

**Frontend**

https://frontend-ten-chi-4dyrsecqit.vercel.app

**Backend**

https://rfq-marketplace.onrender.com

---

## Assumptions

- An RFQ is created and managed by a single Buyer.
- Suppliers can browse available RFQs and submit quotations.
- A Supplier can submit at most one quotation for a particular RFQ.
- Buyers can view quotations received for their own RFQs.
- Authentication and role authorization are handled by the backend.
- The application focuses on the core RFQ marketplace workflow rather than additional marketplace features.

---

## AI Usage

AI tools were used during development as an assistance tool for tasks such as:

- Understanding framework and library usage
- Troubleshooting development and deployment issues
- Reviewing implementation approaches
- Improving code structure and documentation

All generated or assisted code was reviewed, tested, and integrated into the application by the developer. The final implementation and architecture decisions were verified through hands-on testing.

---

## Submission

**Live Application:**  
https://frontend-ten-chi-4dyrsecqit.vercel.app

**GitHub Repository:**  
https://github.com/harshavardhangudla/rfq-marketplace
