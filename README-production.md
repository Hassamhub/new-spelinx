# SPELINX Gaming Platform - Production Deployment

## 🚀 Overview
SPELINX is a professional stake.com-style gaming platform featuring multiple casino games, cryptocurrency payments, and real-time multiplayer features.

## 📋 Features
- 🎮 **Multiple Games**: Wordle, Hangman, TicTacToe, Snake, and more
- 💰 **UPI Payments**: FamPay integration with manual verification
- 🏆 **Leaderboards**: Real-time competitive rankings
- 🎯 **Achievements System**: Gamification features
- 👥 **Referral Program**: Multi-level referral system
- 💬 **Real-time Chat**: WebSocket-powered communication
- 📱 **Responsive Design**: Mobile-first UI/UX
- 🔒 **Secure Authentication**: JWT-based user management

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB
- **Real-time**: Socket.IO
- **Payments**: FamPay UPI (Manual Verification)
- **Authentication**: JWT
- **Database**: MongoDB Atlas

## 📦 Project Structure
```
spelinx-production/
├── backend/          # Express.js server
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Authentication middleware
│   ├── server.js     # Main server file
│   └── .env         # Environment variables
├── frontend/         # React production build
│   ├── index.html
│   ├── assets/
│   └── dist/        # Built static files
└── package.json     # Production scripts
```

## 🚀 Deployment Instructions

### 1. Prerequisites
- Node.js 16+ and npm 8+
- MongoDB Atlas account
- Cryptomus merchant account
- cPanel hosting account

### 2. Environment Setup

#### Backend Configuration (`.env`)
```env
# Database
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/spelinxDB?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_here

# Cryptomus Payment Gateway
CRYPTOMUS_MERCHANT_ID=your_cryptomus_merchant_id
CRYPTOMUS_PAYMENT_KEY=your_cryptomus_payment_key
CRYPTOMUS_PAYOUT_KEY=your_cryptomus_payout_key

# URLs (Update for production)
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com

# Server
PORT=3000
```

### 3. cPanel Deployment

#### Step 1: Upload Files
1. ZIP the entire `spelinx-production` folder
2. Upload to your cPanel File Manager
3. Extract in your public_html or subdomain directory

#### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Go back to root
cd ..
```

#### Step 3: Configure Environment
1. Create `.env` file in `backend/` directory
2. Add all environment variables listed above

#### Step 4: Set Up Node.js Application
1. Go to **Software** → **Setup Node.js App** in cPanel
2. Create new application:
   - **App Directory**: `/home/yourusername/public_html/spelinx-production/backend`
   - **Application URL**: `https://yourdomain.com`
   - **Application startup file**: `server.js`
   - **Node.js version**: 18+ (or latest available)

#### Step 5: Configure Database
1. Create MongoDB Atlas cluster
2. Whitelist your hosting IP
3. Update MONGO_URI in `.env`

#### Step 6: Set Up Payment Gateway
1. Sign up at [Cryptomus](https://cryptomus.com)
2. Get your API credentials
3. Add webhook URLs in Cryptomus dashboard:
   - Deposit callback: `https://yourdomain.com/api/payment/callback/deposit`
   - Withdrawal callback: `https://yourdomain.com/api/payment/callback/withdrawal`

### 4. Static File Serving
Your frontend build is already optimized and ready to serve. The backend serves static files from the `frontend/` directory.

### 5. Domain Configuration
- Point your domain to the hosting server
- Ensure SSL certificate is installed
- Update CORS settings in `server.js` if needed

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Games
- `GET /api/games` - Get available games
- `POST /api/games/play` - Play a game
- `GET /api/games/history` - Game history

### Payments
- `POST /api/payment/submit-deposit` - Submit deposit with screenshot
- `POST /api/payment/request-withdrawal` - Request withdrawal
- `GET /api/payment/my-deposits` - User's deposit history
- `GET /api/payment/transactions` - Transaction history

### Admin (Manual Approval)
- `GET /api/admin/deposits` - List all deposits
- `POST /api/admin/deposits/{id}/approve` - Approve deposit
- `POST /api/admin/deposits/{id}/reject` - Reject deposit

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/update` - Update wallet

## 🔒 Security Features
- JWT authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- SQL injection protection

## 📊 Database Models
- **User**: User accounts and profiles
- **Wallet**: User wallet balances
- **Transaction**: Payment transactions
- **Deposit**: Manual deposit verification records
- **GameHistory**: Game play records
- **Leaderboard**: Competitive rankings
- **Achievement**: User achievements
- **Referral**: Referral system data
- **Referral**: Referral system

## 🎮 Games Included
1. **Wordle** - Word guessing game
4. **Hangman** - Classic word game
5. **TicTacToe** - Strategic board game
6. **Snake** - Classic arcade game
7. **2048** - Number puzzle game
8. **Whack-A-Mole** - Reaction time game

## 🚦 Testing Production Build
```bash
# Start production server
npm start

# Or for development
npm run dev
```

## 🔍 Troubleshooting

### Common Issues:
1. **Database Connection**: Check MongoDB Atlas IP whitelist
2. **Payment Gateway**: Verify Cryptomus credentials
3. **Static Files**: Ensure frontend build is in correct directory
4. **Environment Variables**: Double-check `.env` file syntax

### Logs:
- Check cPanel error logs
- Backend logs in console
- Browser developer tools for frontend issues

## 📞 Support
For deployment issues or technical support, check:
- cPanel documentation
- MongoDB Atlas guides
- Cryptomus API documentation

## 📄 License
This project is proprietary software for SPELINX Gaming Platform.

---

**🎉 Your SPELINX gaming platform is now ready for production deployment!**