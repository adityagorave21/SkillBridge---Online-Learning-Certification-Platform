const express = require('express');
const db = require('../config/db');
const router = express.Router();

const isInstructor = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'instructor') {
        return res.redirect('/auth/login');
    }
    next();
};

router.get('/dashboard', isInstructor, async (req, res) => {
    try {
        const [courses] = await db.query('SELECT * FROM courses WHERE instructor_id = ?', [req.session.user.id]);
        res.render('instructor/dashboard', { user: req.session.user, courses });
    } catch (err) {
        console.error(err);
        res.send('Error loading dashboard');
    }
});

router.get('/course/create', isInstructor, (req, res) => {
    res.render('instructor/create_course', { user: req.session.user });
});

router.post('/course/create', isInstructor, async (req, res) => {
    const { title, description, duration, level } = req.body;
    try {
        await db.query('INSERT INTO courses (title, description, instructor_id, duration, level) VALUES (?, ?, ?, ?, ?)', [title, description, req.session.user.id, duration, level]);
        res.redirect('/instructor/dashboard');
    } catch (err) {
        console.error(err);
        res.send('Error creating course');
    }
});

router.get('/course/:id', isInstructor, async (req, res) => {
    try {
        const [courses] = await db.query('SELECT * FROM courses WHERE id = ? AND instructor_id = ?', [req.params.id, req.session.user.id]);
        const [quizzes] = await db.query('SELECT * FROM quizzes WHERE course_id = ?', [req.params.id]);
        res.render('instructor/course', { user: req.session.user, course: courses[0], quizzes });
    } catch (err) {
        console.error(err);
        res.send('Error loading course');
    }
});

router.get('/course/:id/quiz/create', isInstructor, (req, res) => {
    res.render('instructor/create_quiz', { user: req.session.user, courseId: req.params.id });
});

router.post('/course/:id/quiz/create', isInstructor, async (req, res) => {
    const { title, questions } = req.body;
    try {
        const [result] = await db.query('INSERT INTO quizzes (course_id, title, total_marks) VALUES (?, ?, ?)', [req.params.id, title, questions.length * 10]);
        
        const quizId = result.insertId;
        
        for (let q of questions) {
            await db.query('INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)', [quizId, q.text, q.a, q.b, q.c, q.d, q.correct]);
        }
        
        res.redirect('/instructor/course/' + req.params.id);
    } catch (err) {
        console.error(err);
        res.send('Error creating quiz');
    }
});

module.exports = router;
