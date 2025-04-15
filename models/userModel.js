const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Find a user by their username
const findByUsername = async (username) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      return result.rows[0]; // returns the user object if found
    } catch (err) {
      console.error('Error fetching user:', err.message);
      console.error('Stack trace:', err.stack);
      throw new Error('Error querying the database');
    }
  };
  

// Create a new user
const createUser = async (username, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    return result.rows[0]; // returns the newly created user
  } catch (err) {
    console.error('Error inserting user:', err);
    throw new Error('Error inserting into the database');
  }
};

module.exports = {
  findByUsername,
  createUser,
};
