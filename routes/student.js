const express = require('express');
const db = require('../config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const isStudent = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'student') {
        return res.redirect('/auth/login');
    }
    next();
};

router.get('/dashboard', isStudent, async (req, res) => {
    try {
        const [enrollments] = await db.query('SELECT c.*, e.progress, e.completed FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ?', [req.session.user.id]);
        res.render('student/dashboard', { user: req.session.user, enrollments });
    } catch (err) {
        console.error(err);
        res.send('Error loading dashboard');
    }
});

router.get('/courses', isStudent, async (req, res) => {
    try {
        const [courses] = await db.query('SELECT c.*, u.username as instructor_name FROM courses c JOIN users u ON c.instructor_id = u.id');
        res.render('student/courses', { user: req.session.user, courses });
    } catch (err) {
        console.error(err);
        res.send('Error loading courses');
    }
});

router.post('/enroll/:id', isStudent, async (req, res) => {
    try {
        await db.query('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)', [req.session.user.id, req.params.id]);
        res.redirect('/student/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/student/courses');
    }
});

router.get('/course/:id', isStudent, async (req, res) => {
    try {
        const [courses] = await db.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
        const [quizzes] = await db.query('SELECT * FROM quizzes WHERE course_id = ?', [req.params.id]);
        res.render('student/course', { user: req.session.user, course: courses[0], quizzes });
    } catch (err) {
        console.error(err);
        res.send('Error loading course');
    }
});

router.get('/quiz/:id', isStudent, async (req, res) => {
    try {
        const [quizzes] = await db.query('SELECT * FROM quizzes WHERE id = ?', [req.params.id]);
        const [questions] = await db.query('SELECT * FROM questions WHERE quiz_id = ?', [req.params.id]);
        res.render('student/quiz', { user: req.session.user, quiz: quizzes[0], questions });
    } catch (err) {
        console.error(err);
        res.send('Error loading quiz');
    }
});

router.post('/quiz/:id/submit', isStudent, async (req, res) => {
    try {
        const [questions] = await db.query('SELECT * FROM questions WHERE quiz_id = ?', [req.params.id]);
        let score = 0;
        questions.forEach(q => {
            if (req.body['question_' + q.id] === q.correct_answer) {
                score += q.marks;
            }
        });
        const [quizzes] = await db.query('SELECT * FROM quizzes WHERE id = ?', [req.params.id]);
        await db.query('INSERT INTO quiz_attempts (student_id, quiz_id, score, total_marks) VALUES (?, ?, ?, ?)', [req.session.user.id, req.params.id, score, quizzes[0].total_marks]);
        
        const passPercentage = (score / quizzes[0].total_marks) * 100;
        if (passPercentage >= 60) {
            const [quiz] = await db.query('SELECT course_id FROM quizzes WHERE id = ?', [req.params.id]);
            await db.query('UPDATE enrollments SET completed = TRUE, progress = 100 WHERE student_id = ? AND course_id = ?', [req.session.user.id, quiz[0].course_id]);
            res.redirect('/student/certificate/' + quiz[0].course_id);
        } else {
            res.send('<h1>Quiz Completed! Score: ' + score + '/' + quizzes[0].total_marks + '</h1><a href="/student/dashboard">Back to Dashboard</a>');
        }
    } catch (err) {
        console.error(err);
        res.send('Error submitting quiz');
    }
});

router.get('/certificate/:courseId', isStudent, async (req, res) => {
    try {
        const [courses] = await db.query('SELECT * FROM courses WHERE id = ?', [req.params.courseId]);
        const course = courses[0];
        
        const fileName = 'certificate_' + req.session.user.id + '_' + req.params.courseId + '.pdf';
        const filePath = path.join(__dirname, '../certificates', fileName);
        
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(filePath));
        
        doc.fontSize(30).text('Certificate of Completion', 100, 100, { align: 'center' });
        doc.fontSize(20).text('This is to certify that', 100, 200, { align: 'center' });
        doc.fontSize(25).text(req.session.user.username, 100, 240, { align: 'center' });
        doc.fontSize(18).text('has successfully completed the course', 100, 300, { align: 'center' });
        doc.fontSize(22).text(course.title, 100, 340, { align: 'center' });
        doc.fontSize(14).text('Date: ' + new Date().toLocaleDateString(), 100, 400, { align: 'center' });
        
        doc.end();
        
        await db.query('INSERT INTO certificates (student_id, course_id, certificate_path) VALUES (?, ?, ?)', [req.session.user.id, req.params.courseId, filePath]);
        
        res.download(filePath);
    } catch (err) {
        console.error(err);
        res.send('Error generating certificate');
    }
});

module.exports = router;
