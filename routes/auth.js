const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();

// Login Page
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Login POST
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.render('login', { error: 'Invalid credentials' });
        }
        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('login', { error: 'Invalid credentials' });
        }
        req.session.user = { id: user.id, username: user.username, role: user.role };
        
        if (user.role === 'student') return res.redirect('/student/dashboard');
        if (user.role === 'instructor') return res.redirect('/instructor/dashboard');
        if (user.role === 'admin') return res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Server error' });
    }
});

// Register Page
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// Register POST
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role || 'student']);
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.render('register', { error: 'User already exists or error occurred' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
