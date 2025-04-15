const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

// Find a user by their username
const findByUsername = async (username) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0]; // returns the user object if found
  } catch (err) {
    throw new Error('Error querying the database');
  }
};

// Create a new user in the database
const createUser = async (username, email, password) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  
      // Attempt to insert the new user into the database
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
      );
  
      return result.rows[0]; // return the newly created user object
    } catch (err) {
      // Log the error message and additional details
      console.error('Error inserting user:');
      console.error('Message:', err.message);  // Log the message
      console.error('Stack trace:', err.stack);  // Log the stack trace
      console.error('SQL Query:', 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)');
      console.error('Query Params:', [username, email, hashedPassword]);
      throw new Error('Error inserting into the database');
    }
  };
  
  

// Compare password with hashed password in the database
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  findByUsername,
  createUser,
  comparePassword
};
