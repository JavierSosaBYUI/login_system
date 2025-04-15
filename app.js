require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const { Pool } = require('pg');

const app = express();

// PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // To parse form data

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Controller imports
const authController = require('./controllers/authController');

// Routes
app.get('/', authController.getLoginPage);
app.post('/login', authController.login);
app.get('/dashboard', authController.dashboard);
app.get('/logout', authController.logout);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});


pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

// Render the register page
app.get('/register', authController.getRegisterPage);

// Handle registration form submission
app.post('/register', authController.register);
