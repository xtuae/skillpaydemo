# SkillPay Demo - Payment Integration

A React/Next.js application demonstrating SkillPay payment integration with seamless UPI payments, transaction management, and Vercel Neon database storage.

## Features

- **Seamless UPI Payment Integration**: Direct integration with SkillPay API
- **Real-time Payment Status**: Automatic polling for payment status updates
- **Transaction Management**: Store and view all payment transactions
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Secure**: AES-256 encryption for API communication
- **Database Storage**: Vercel Neon PostgreSQL for transaction persistence

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel Neon (PostgreSQL)
- **API Integration**: SkillPay Payment Gateway
- **Encryption**: crypto-js (AES-256)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+ installed
- Vercel Neon database account
- SkillPay API credentials (AuthID and AuthKey)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd skillpay-demo
npm install
```

### 2. Set Up Vercel Neon Database

1. Create a free account at [Neon](https://neon.tech)
2. Create a new project and database
3. Copy your database connection string
4. Run the database setup script:

```bash
node setup-database.js
```

This will automatically create the transactions table and necessary indexes.

### 3. Configure Environment Variables

The `.env.local` file is already configured with the provided SkillPay credentials. You just need to add your Neon database URL:

```env
# Neon Database
DATABASE_URL=postgres://your_neon_connection_string

# SkillPay API Configuration (Already configured)
NEXT_PUBLIC_SKILLPAY_AUTH_ID=M00006572
NEXT_PUBLIC_SKILLPAY_AUTH_KEY=Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo
NEXT_PUBLIC_SKILLPAY_API_URL=https://dashboard.skill-pay.in/pay
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note**: The application includes a demo mode that uses in-memory storage if the database is not configured, allowing you to test the functionality without setting up Neon.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Application Structure

```
skillpay-demo/
├── app/
│   ├── api/
│   │   ├── payment/
│   │   │   ├── init/         # Payment initialization
│   │   │   ├── status/       # Transaction status check
│   │   │   └── callback/     # Payment callback handler
│   │   └── transactions/     # Get all transactions
│   ├── transaction/[id]/     # Individual transaction page
│   ├── transactions/         # Transaction list page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home/Payment page
├── lib/
│   ├── crypto.ts            # AES encryption utilities
│   └── db/
│       ├── index.ts         # Database functions
│       └── schema.sql       # Database schema
└── public/                  # Static assets
```

## API Endpoints

- `POST /api/payment/init` - Initialize a new payment
- `GET /api/payment/status?custRefNum={ref}` - Check payment status
- `POST /api/payment/callback` - Handle payment callbacks
- `GET /api/transactions` - Get all transactions

## Usage

### Making a Payment

1. Navigate to the home page
2. Enter payment details:
   - Amount (in INR)
   - Mobile number (10 digits)
   - Email address
3. Click "Initiate Payment"
4. Use the generated UPI link/QR code to complete payment
5. The status will update automatically

### Viewing Transactions

1. Click "Transactions" in the navigation
2. View all past transactions in a table
3. Click "View" to see detailed transaction information

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/xtuae/skillpaydemo.git
   git push -u origin main
   ```

2. **Import in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub repository
   - Select `skillpaydemo`

3. **Configure Environment Variables** in Vercel:
   - `DATABASE_URL` - Your Neon database connection string
   - `NEXT_PUBLIC_SKILLPAY_AUTH_ID` - M00006572
   - `NEXT_PUBLIC_SKILLPAY_AUTH_KEY` - Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo
   - `NEXT_PUBLIC_SKILLPAY_API_URL` - https://dashboard.skill-pay.in/pay
   - `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL (e.g., https://skillpaydemo.vercel.app)

4. **Deploy** - Vercel will automatically build and deploy

### Important Notes for Production

1. **Update Callback URL**: After deployment, update the callback URL in the payment initialization to use your production domain:
   ```
   CallbackURL: "https://your-app.vercel.app/api/payment/callback"
   ```

2. **Database Setup**: Run the database setup script with your production database

3. **Security Considerations**:
   - Enable CORS only for SkillPay domains
   - Implement rate limiting
   - Add authentication for sensitive endpoints
   - Use environment variables for all sensitive data

### Vercel Configuration

The project includes a `vercel.json` file that:
- Sets up proper build configuration
- Maps environment variables
- Configures API function timeouts
- Ensures proper Next.js deployment

## Security Considerations

- API credentials are stored in environment variables
- All payment data is encrypted using AES-256
- Database connections use SSL
- Consider implementing rate limiting for production
- Add authentication for viewing transactions in production

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your DATABASE_URL is correct
   - Ensure Neon database is active

2. **Payment Initialization Fails**
   - Check API credentials
   - Verify network connectivity to SkillPay API

3. **Encryption/Decryption Errors**
   - Ensure AuthKey is correct
   - Check IV generation (first 16 chars of AuthKey)

## Support

For SkillPay API issues, refer to the official documentation.
For application issues, check the console logs and network tab in browser developer tools.

## License

This is a demo application for educational purposes.
