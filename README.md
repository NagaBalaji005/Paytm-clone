# 💸 Paytm Clone – Digital Payment Wallet (MERN Stack)

A fully functional digital payment wallet application inspired by **Paytm**, built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js), styled with **Tailwind CSS**, and powered by **Vite**. This app enables secure user registration, wallet management, money transfers with OTP verification, and transaction history.

---
## 🚀 Features

- 🔐 **User Authentication**  
  - Register & Login with email/phone
  - JWT-based token authentication
  - Encrypted passwords using bcrypt

- 👛 **Wallet Management**  
  - Real-time wallet balance tracking
  - Add money to wallet
  - OTP confirmation for money transfer

- 💸 **Transactions**  
  - Send/receive money to/from other users
  - Store all transactions in MongoDB
  - Filterable transaction history (date/type)

- 📦 **Backend APIs (REST)**  
  - Auth, wallet, transaction routes
  - Modular controllers and services

- 🎨 **Frontend UI**  
  - Tailwind CSS design
  - React hooks & context for state management
  - Responsive, clean, and user-friendly interface

---

## 🧱 Tech Stack

### 🔹 Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### 🔹 Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (Authentication)
- Bcrypt.js (Password hashing)
- Nodemailer or Twilio (for OTP — optional)

---

## 📁 Folder Structure

### Backend (`/backend`)

/backend
├── controller/ # Logic for auth, wallet, transactions
├── db/ # MongoDB connection
├── model/ # Mongoose schemas
├── node_modules #backend
├── routes/ # API endpoints
├── services/ # OTP & utility services
├── .env # Environment variables
├── app.js # Express setup
├── server.js # Entry point
├── package-lock.json
├── package.json

### Frontend (`/frontend`)
/frontend
├── node_modules
├── src/
│ ├── assets/ # Images, icons, etc.
│ ├── components/ # Reusable UI components
│ ├── context/ # Global state (Auth, Wallet, etc.)
│ ├── pages/ # Views (Home, Wallet, Login, transaction, history, etc.)
│ ├── App.css #styling
│ ├── App.jsx # Main component
│ ├── main.jsx # App entry point
│ ├── index.css # Global styles
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
---

## 🔐 Environment Variables

Create a `.env` file in your backend root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OTP_SECRET=your_otp_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

🛠️ Installation & Setup
1. Clone the Repository
bash
git clone https://github.com/your-username/paytm-clone-wallet.git
cd paytm-clone-wallet
2. Backend Setup
bash
cd backend
npm install
npm run dev
3. Frontend Setup
bash
cd frontend
npm install
npm run dev
📸 Screenshots
Login Page	Wallet Dashboard	Transaction History

🧪 Testing
Register a new user

Add funds to wallet (mock)

Send funds to another user

OTP-based transaction confirmation

Check transaction history

🧠 Future Improvements
✅ Mobile number verification via Twilio

✅ P2P QR code scanning

✅ Notifications via Email/SMS

✅ Dark mode toggle

✅ Admin dashboard

📬 Connect with Me
Naga Balaji
• LinkedIn : [Your_Link_Here](https://www.linkedin.com/in/adapala-naga-balaji-339b4131a/)
• GitHub : [Your_Link_Here](https://github.com/NagaBalaji005)

📄 License
This project is licensed under the MIT License.

Inspired by India's most used digital wallet — Paytm
