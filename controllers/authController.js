const userModel = require('../models/userModel');

// Render the login page
exports.getLoginPage = (req, res) => {
  res.render('login');
};

// Handle Login Logic
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Compare passwords
    const isMatch = await userModel.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    // Start a session and redirect to dashboard
    req.session.userId = user.id;
    req.session.username = user.username;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Dashboard Page (after login)
exports.dashboard = (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }

  res.render('dashboard', { username: req.session.username });
};

// Handle Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }

    res.redirect('/');
  });
};


// Render the register page
exports.getRegisterPage = (req, res) => {
    res.render('register');
  };
  
  // Handle Register Logic
  exports.register = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await userModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).send('Username already taken');
      }
  
      // Create new user
      const newUser = await userModel.createUser(username, email, password);
      
      // Redirect to login after successful registration
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  };
  