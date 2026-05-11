require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database Table
const initDB = async () => {
  try {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'student',
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        password TEXT NOT NULL,
        address TEXT,
        mess_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createTicketsTable = `
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(50) UNIQUE NOT NULL,
        user_name VARCHAR(255),
        mess_name VARCHAR(255),
        category VARCHAR(100),
        subject TEXT,
        description TEXT,
        status VARCHAR(50) DEFAULT 'Open',
        priority VARCHAR(50) DEFAULT 'Medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await db.query(createUsersTable);
    await db.query(createTicketsTable);
    
    // Ensure columns exist (if table was already there)
    try {
      await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE');
      await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT \'student\'');
      await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT \'Active\'');
      await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS mess_name VARCHAR(255)');
      await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS menu_data JSONB');
      await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS details JSONB');
    } catch (colErr) {
      console.log("Column check/add finished.");
    }
    
    console.log("Database initialized: 'users' table ready.");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

initDB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Grubspot API' });
});

app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ status: 'ok', db_time: result.rows[0].now });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// User Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, phone, role, password, address, mess_name } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Email is already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await db.query(
      'INSERT INTO users (name, email, phone, role, password, address, mess_name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, phone, role, address, mess_name',
      [name, email, phone, role, hashedPassword, address || null, mess_name || null]
    );

    res.status(201).json({ status: 'success', message: 'User registered successfully', user: newUser.rows[0] });

  } catch (error) {
    console.error('Signup error details:', error);
    res.status(500).json({ status: 'error', message: `Internal server error: ${error.message}` });
  }
});

// --- Admin Data Endpoints ---

// Get all users (students and owners)
app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, phone, role, status, created_at FROM users ORDER BY created_at DESC');
    res.json({ status: 'success', users: result.rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get all messes (users with role 'mess_owner')
app.get('/api/admin/messes', async (req, res) => {
  try {
    const result = await db.query("SELECT id, name, email, phone, status, mess_name, address, created_at FROM users WHERE role = 'mess_owner' ORDER BY created_at DESC");
    res.json({ status: 'success', messes: result.rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get all tickets
app.get('/api/admin/tickets', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tickets ORDER BY created_at DESC');
    res.json({ status: 'success', tickets: result.rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Update user/mess status
app.post('/api/admin/update-status', async (req, res) => {
  try {
    const { id, status } = req.body;
    await db.query('UPDATE users SET status = $1 WHERE id = $2', [status, id]);
    res.json({ status: 'success', message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Update ticket status
app.post('/api/admin/update-ticket-status', async (req, res) => {
  try {
    const { ticket_id, status } = req.body;
    await db.query('UPDATE tickets SET status = $1 WHERE ticket_id = $2', [status, ticket_id]);
    res.json({ status: 'success', message: 'Ticket status updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Admin: Add Mess Owner Route
app.post('/api/admin/add-mess-owner', async (req, res) => {
  try {
    const { name, email, username, password, phone, mess_name, address } = req.body;

    if (!name || !email || !username || !password || !phone || !mess_name) {
      return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
    }

    // Check if email or username exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Email or Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert Mess Owner
    const newUser = await db.query(
      'INSERT INTO users (name, email, username, phone, role, password, address, mess_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, username, phone, role, address, mess_name',
      [name, email, username, phone, 'mess_owner', hashedPassword, address || null, mess_name]
    );

    res.status(201).json({ status: 'success', message: 'Mess Owner created successfully', user: newUser.rows[0] });

  } catch (error) {
    console.error('Admin add-mess-owner error:', error);
    res.status(500).json({ status: 'error', message: `Internal server error: ${error.message}` });
  }
});


// Public Routes for Students
app.get('/api/messes', async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, mess_name, address, phone, email, created_at, menu_data, details FROM users WHERE role = 'mess_owner' AND status = 'Active' ORDER BY created_at DESC"
    );
    res.json({ status: 'success', messes: result.rows });
  } catch (error) {
    console.error('Error fetching messes:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch messes' });
  }
});

// User Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // 'identifier' can be email or username

    if (!identifier || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide identifier and password' });
    }

    // Fetch user by email or username
    const userResult = await db.query('SELECT * FROM users WHERE email = $1 OR username = $1', [identifier]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Since we are not using JWT, we just send a success flag and user info (without password)
    delete user.password;

    res.json({ status: 'success', message: 'Login successful', user });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error during login' });
  }
});


// Update User Profile
app.post('/api/users/update-profile', async (req, res) => {
  try {
    const { id, name, mess_name, phone, address, email, details } = req.body;

    if (!id) {
      return res.status(400).json({ status: 'error', message: 'User ID is required' });
    }

    await db.query(
      'UPDATE users SET name = $1, mess_name = $2, phone = $3, address = $4, email = $5, details = $6 WHERE id = $7',
      [name, mess_name, phone, address, email, JSON.stringify(details || {}), id]
    );

    // Fetch updated user
    const updatedUser = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = updatedUser.rows[0];
    delete user.password;

    res.json({ status: 'success', message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});


// Update Mess Menu
app.post('/api/users/update-menu', async (req, res) => {
  try {
    const { id, menu_data } = req.body;

    if (!id) {
      return res.status(400).json({ status: 'error', message: 'User ID is required' });
    }

    await db.query(
      'UPDATE users SET menu_data = $1 WHERE id = $2',
      [JSON.stringify(menu_data), id]
    );

    res.json({ status: 'success', message: 'Menu updated successfully' });
  } catch (error) {
    console.error('Update menu error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
