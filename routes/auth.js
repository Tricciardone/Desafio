const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Ruta de registro
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Ruta de login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/main',
  failureRedirect: '/login'
}));

// Rutas de autenticación con Github
router.get('/github', passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    res.redirect('/main');
  });

module.exports = router;
