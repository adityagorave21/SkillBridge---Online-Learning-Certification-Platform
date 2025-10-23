const express = require('express');
const db = require('../config/db');
const router = express.Router();

const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/auth/login');
    }
    next();
};

// Admin Dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        const [courses] = await db.query('SELECT c.*, u.username as instructor_name FROM courses c JOIN users u ON c.instructor_id = u.id');
        res.render('admin/dashboard', { user: req.session.user, users, courses });
    } catch (err) {
        console.error(err);
        res.send('Error loading dashboard');
    }
});

// Delete User
router.post('/user/delete/:id', isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/dashboard');
    }
});

// Delete Course
router.post('/course/delete/:id', isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/dashboard');
    }
});

module.exports = router;
