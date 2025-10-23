const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const instructorRoutes = require('./routes/instructor');
const adminRoutes = require('./routes/admin');

app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/instructor', instructorRoutes);
app.use('/admin', adminRoutes);

// Home Route
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

// Start Server
app.listen(PORT, () => {
    console.log('SkillBridge server running on http://localhost:' + PORT);
});
