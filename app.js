require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const bodyParser = require('body-parser');
const candidatesRouter = require('./candidates');
const companiesRouter = require('./companies');
const { roles, checkRole } = require('./middleware/roleAuth');
const adminEmails = require('./config/adminConfig');
const contactRouter = require('./contact');
const jobPostingsRouter = require('./jobPostings');

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

// Check for required environment variables
if (!process.env.JWT_SECRET || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL || 'http://localhost';

// Configure Passport Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/api/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(refreshToken);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Google Login route
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback route
app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const email = req.user.emails[0].value;
      let userRole = roles.USER; // Default role

      // Check if the email belongs to super admin or admin
      if (adminEmails.superAdmins.includes(email)) {
        userRole = roles.SUPER_ADMIN;
      } else if (adminEmails.admins.includes(email)) {
        userRole = roles.ADMIN;
      }

      const user = {
        id: req.user.id,
        displayName: req.user.displayName,
        email: email,
        role: userRole
      };

      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user });
    } catch (error) {
      console.error('Authentication failed:', error);
      res.status(401).send('Authentication failed');
    }
  }
);
// Unprotected route
app.get('/api/protected', (req, res) => {
  res.status(200).json({ message: 'You have access to this unprotected route!' });
});
// Public route - no authentication needed
app.use('/api', contactRouter);
// Add the jobPostings router without authentication
app.use('/api', jobPostingsRouter);

// Protect API routes
app.use('/api', authenticateJWT, candidatesRouter);
app.use('/api', authenticateJWT, companiesRouter);


// Add this route to view role assignments
app.get('/api/roles', 
  authenticateJWT,
  checkRole([roles.SUPER_ADMIN]),
  (req, res) => {
    res.json({
      superAdmins: adminEmails.superAdmins,
      admins: adminEmails.admins
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
})