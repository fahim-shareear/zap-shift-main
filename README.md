# Zap Shift - Parcel Delivery Platform

A comprehensive full-stack parcel delivery and logistics management platform that connects users, riders, and administrators for efficient parcel delivery operations. The system provides real-time tracking, payment processing, and complete business management features.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [User Roles and Permissions](#user-roles-and-permissions)
- [Key Functionalities](#key-functionalities)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Zap Shift is a modern logistics platform designed to streamline the parcel delivery process. It enables customers to send parcels through an intuitive interface, provides riders with job assignments and earnings management, and gives administrators full control over operations including user management, rider approvals, and parcel assignments.

The platform leverages real-time event streaming, secure payment processing, and role-based access control to create a reliable and scalable delivery ecosystem.

## Key Features

### User Features
- User registration and authentication with Firebase
- Send parcel requests with sender and receiver information
- Real-time parcel tracking with tracking ID
- Integrated payment processing via Stripe
- Payment history and transaction records
- Coverage area checking before parcel booking
- Pricing calculator based on service category
- Feedback and review submission

### Rider Features
- Apply to become a rider through application portal
- View assigned parcels and delivery status
- Update delivery status for parcels
- Track daily delivery statistics
- Access earnings and commission information
- Manage work status (available/in-delivery)
- View payroll and earnings history

### Admin Features
- Comprehensive user management dashboard
- Approve or reject rider applications
- Assign riders to pending parcels
- Monitor delivery statistics and status reports
- Manage user roles and permissions
- Payroll management and commission approval
- View all users, riders, and parcels
- Search and filter functionality across all entities

### System Features
- Automatic tracking ID generation with timestamp
- Real-time parcel status updates with event streaming
- Secure Firebase authentication verification
- Role-based access control with middleware
- Complete payment history tracking
- Comprehensive tracking log system
- Internet connection detection for reliability

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB 7.1.0
- **Authentication**: Firebase Admin SDK 13.7.0
- **Payment Gateway**: Stripe 21.0.0
- **Middleware**: CORS, Express JSON parser
- **Environment Management**: dotenv
- **Development**: Nodemon

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS 4.1.18 with DaisyUI 5.5.18
- **Routing**: React Router 7.13.0
- **Forms**: React Hook Form 7.71.2
- **API Client**: Axios 1.13.6
- **State Management**: TanStack React Query 5.95.0
- **Authentication**: Firebase SDK 12.9.0
- **Animations**: Framer Motion 12.34.3
- **Maps**: Leaflet 1.9.4 with React Leaflet 5.0.0-rc.2
- **Data Visualization**: Recharts 3.8.1
- **UI Components**: React Icons 5.5.0, SweetAlert2 11.26.24
- **Carousels**: Swiper 12.1.1, React Responsive Carousel 3.2.23
- **Notifications**: React Hot Toast 2.6.0
- **Code Quality**: ESLint with React hooks plugin

### Development Tools
- Vite with React plugin
- ESLint for code quality
- Tailwind CSS Vite plugin

## Project Structure

```
zap-shift-main/
├── zap-shift-server/                    # Backend Express.js API
│   ├── index.js                         # Main server file with all API endpoints
│   ├── keyconvert.js                    # Utility for Firebase key conversion
│   ├── package.json                     # Backend dependencies
│   ├── vercel.json                      # Vercel deployment configuration
│   └── zap-shift-firebase-sdk-key.json  # Firebase credentials (gitignored)
│
└── zap-shift-ui/                        # Frontend React application
    ├── src/
    │   ├── main.jsx                     # React entry point
    │   ├── App.css                      # Global styles
    │   ├── index.css                    # Base styles
    │   ├── assets/                      # Static assets
    │   │   ├── warehouses.json          # Warehouse data
    │   │   ├── banner/                  # Banner images
    │   │   └── brands/                  # Brand logos
    │   ├── authcontext/                 # Authentication context
    │   │   ├── AuthContext.jsx
    │   │   └── AuthProvider.jsx
    │   ├── beArider/                    # Rider application form
    │   │   └── RiderForm.jsx
    │   ├── components/                  # Reusable components
    │   │   ├── ParcelForm.jsx           # Parcel booking form
    │   │   └── logo/
    │   ├── customHooks/                 # Custom React hooks
    │   │   ├── useAuth.jsx
    │   │   ├── useAxiosSecure.jsx
    │   │   ├── useClickAnimation.jsx
    │   │   └── useTime.jsx
    │   ├── firebase/                    # Firebase configuration
    │   │   └── firebase.init.js
    │   ├── hooks/                       # Additional custom hooks
    │   │   ├── useAuth.jsx
    │   │   ├── useAxios.jsx
    │   │   └── useRole.jsx
    │   ├── layouts/                     # Layout components
    │   │   ├── AdminLayout.jsx
    │   │   ├── AuthLayout.jsx
    │   │   ├── DashboardLayout.jsx
    │   │   ├── RiderLayout.jsx
    │   │   └── RootLayout.jsx
    │   ├── pages/                       # Page components
    │   │   ├── about/
    │   │   ├── Auth/
    │   │   ├── Dashboard/
    │   │   ├── home/
    │   │   ├── sendAparcel/
    │   │   ├── shared/
    │   │   └── Trackparcel/
    │   └── routes/
    │       ├── routes.jsx               # Route configuration
    │       └── PrivateRoutes.jsx        # Protected routes
    ├── public/
    │   └── serviceCenter.json           # Service center data
    ├── package.json                     # Frontend dependencies
    ├── vite.config.js                   # Vite configuration
    ├── eslint.config.js                 # ESLint configuration
    ├── index.html                       # HTML entry point
    └── README.md                        # Frontend documentation
```

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud database)
- Firebase project account
- Stripe account for payment processing
- npm or yarn package manager

### Backend Setup

1. Navigate to the server directory:
```bash
cd zap-shift-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with required variables (see Environment Variables section)

4. Start the development server:
```bash
npm run dev
```

The server will run on the port specified in the environment variables (default: 3000)

### Frontend Setup

1. Navigate to the UI directory:
```bash
cd zap-shift-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The development server will typically run on `http://localhost:5173`

4. Build for production:
```bash
npm run build
```

## Environment Variables

### Backend (.env)

```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/zapShift
FB_SERVICE_KEY=<base64-encoded-firebase-service-account-key>
STRIPE_SECRET=sk_test_your_stripe_secret_key
SITE_URL=http://localhost:5173
```

### Frontend (.env or .env.local)

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:3000
```

## API Documentation

### Authentication Endpoints

- **POST** `/users` - Register a new user
- **GET** `/users/:email/role` - Get user role information
- **GET** `/users` - Get all users (admin only, requires Firebase verification)
- **PATCH** `/users/:id/role` - Update user role (admin only)

### Parcel Endpoints

- **POST** `/parcels` - Create a new parcel order
- **GET** `/parcels` - Get user's parcels (filtered by email)
- **GET** `/parcels/:id` - Get specific parcel details
- **PATCH** `/parcels/:id` - Assign rider to parcel (admin only)
- **PATCH** `/parcels/:id/status` - Update parcel delivery status
- **DELETE** `/parcels/:id` - Delete a parcel
- **GET** `/parcels/devlivery-status/stats/` - Get delivery status statistics (admin only)
- **GET** `/parcels/riders` - Get parcels for rider (rider only)

### Payment Endpoints

- **POST** `/create-checkout-session` - Create Stripe checkout session
- **PATCH** `/payment-success` - Process successful payment
- **GET** `/payments` - Get payment history for user

### Rider Endpoints

- **POST** `/riders` - Apply to become a rider
- **GET** `/riders` - Get all riders (admin only, with filters)
- **PATCH** `/riders/:id` - Approve/reject rider application (admin only)
- **DELETE** `/riders/:id` - Delete rider application
- **GET** `/riders/delivery-per-day` - Get delivery statistics for rider (rider only)

### Tracking Endpoints

- **GET** `/trackings/:trackingId/logs` - Get tracking logs for parcel
- **GET** `/trackings/:trackingId/stream` - Server-sent events stream for real-time tracking

### Payroll Endpoints

- **POST** `/payroll/add-commissions` - Submit commission (rider only)
- **GET** `/payroll` - Get all payroll records (admin only, with filters)
- **GET** `/payroll/:riderEmail` - Get rider's payroll records
- **PATCH** `/payroll/:id/status` - Update payroll status (admin only)

### Other Endpoints

- **GET** `/feedback` - Get all feedback submissions
- **POST** `/feedback` - Submit feedback (implied, based on schema)

## Database Schema

### Collections

#### users
```javascript
{
  _id: ObjectId,
  email: String,
  displayName: String,
  role: String, // 'user', 'rider', 'admin'
  createdAt: Date
}
```

#### parcels
```javascript
{
  _id: ObjectId,
  senderEmail: String,
  parcelName: String,
  cost: Number,
  trackingId: String, // Generated automatically
  deliveryStatus: String, // 'parcel-created', 'parcel-paid', 'rider-assigned', 'pending-pickup', 'in-transit', 'delivered'
  paymentStatus: String, // 'unpaid', 'paid'
  riderId: ObjectId,
  riderEmail: String,
  riderName: String,
  // Additional fields: sender info, receiver info, etc.
  createdAt: Date
}
```

#### payments
```javascript
{
  _id: ObjectId,
  sessionId: String,
  name: String,
  amount: Number,
  currency: String,
  customer_email: String,
  parcelId: ObjectId,
  parcelName: String,
  transactionId: String,
  paymentStatus: String,
  trackingId: String,
  paidAt: Date
}
```

#### riders
```javascript
{
  _id: ObjectId,
  riderEmail: String,
  riderName: String,
  district: String,
  status: String, // 'pending', 'approved', 'rejected'
  workStatus: String, // 'available', 'In Delivery'
  // Additional fields: phone, vehicle info, etc.
  createdAt: Date
}
```

#### trackings
```javascript
{
  _id: ObjectId,
  trackingId: String,
  status: String,
  details: String,
  createdAt: Date
}
```

#### payroll
```javascript
{
  _id: ObjectId,
  riderEmail: String,
  riderName: String,
  totalCommission: Number,
  parcelCount: Number,
  submittedDate: Date,
  month: String,
  status: String, // 'pending', 'approved', 'paid'
  createdAt: Date,
  updatedAt: Date
}
```

#### feedback
```javascript
{
  _id: ObjectId,
  // Fields depend on feedback form structure
  createdAt: Date
}
```

## User Roles and Permissions

### User Role
- Register and login
- Send parcels
- Track parcels in real-time
- Pay for parcels via Stripe
- View payment history
- Submit feedback
- View service coverage and pricing

### Rider Role
- Must apply and be approved by admin
- View assigned parcels
- Update delivery status
- Track daily delivery statistics
- Submit commission/earnings
- View payroll and earnings history
- Receive assignments from admin

### Admin Role
- Approve or reject rider applications
- Manage all users and their roles
- Assign riders to pending parcels
- View all parcels and delivery statistics
- Manage payroll and rider commissions
- Access user management dashboard
- View comprehensive analytics and reports

## Key Functionalities

### Parcel Booking and Tracking
- Users can book parcels with complete sender and receiver information
- Automatic tracking ID generation using timestamp and random values
- Real-time status updates through event streaming
- Comprehensive tracking logs for each parcel
- Multiple delivery statuses: created, paid, rider-assigned, pending-pickup, in-transit, delivered

### Payment Processing
- Stripe integration for secure payment processing
- One-time checkout session creation
- Payment verification and parcel status update upon successful payment
- Complete payment history tracking
- Support for multiple currencies

### Rider Management
- Application system with approval workflow
- Status tracking: pending, approved, rejected
- Work status management: available, in-delivery
- Automatic role assignment upon approval
- Delivery statistics and daily performance metrics

### Real-Time Tracking
- Server-sent events (SSE) for live parcel tracking
- Change stream monitoring for database updates
- Heartbeat mechanism for connection stability
- Tracking log history for audit trail
- Multiple status events recorded with timestamps

### Commission and Payroll
- Monthly commission submission by riders
- Commission tracking and calculation
- Payroll status workflow: pending, approved, paid
- Admin approval system for rider commissions
- Rider earnings history and analytics

### Authentication and Authorization
- Firebase authentication integration
- Secure token verification
- Role-based access control (RBAC)
- Protected endpoints with middleware
- Email-based verification for sensitive operations

### User Management
- Search and filter users by name and email
- Role assignment and modification
- User deletion capability
- User list viewing with sorting
- Comprehensive user information display

## Deployment

### Backend Deployment (Vercel)

The backend is configured for Vercel deployment using the included `vercel.json` file:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel project settings
3. Push to main branch for automatic deployment
4. API will be accessible at your Vercel deployment URL

### Frontend Deployment

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting service

3. Configure your API endpoints in environment variables to point to your backend deployment

## Contributing

This is a full-stack project with both backend and frontend components. When contributing:

1. Ensure code follows project conventions
2. Test all API endpoints thoroughly
3. Maintain compatibility with existing database schemas
4. Update documentation for new features
5. Follow React and Express.js best practices
6. Use proper error handling and validation

## License

This project is provided as-is for educational and commercial use.

---

**Project Status**: Active Development

For questions or support regarding the Zap Shift platform, please refer to the project documentation or contact the development team.
