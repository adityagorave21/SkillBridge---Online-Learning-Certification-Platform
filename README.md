# 🎓 SkillBridge - Online Learning & Certification Platform

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A comprehensive **Learning Management System (LMS)** where students can enroll in courses, complete quizzes, and earn certificates. Instructors can create and manage courses while administrators oversee the entire platform.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Demo Credentials](#demo-credentials)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## ✨ Features

### 👨‍🎓 **Student Features**
- ✅ User registration and authentication
- ✅ Browse available courses
- ✅ Enroll in courses
- ✅ Take quizzes with multiple-choice questions
- ✅ Automatic quiz grading
- ✅ Download PDF certificates upon course completion (60% passing score)
- ✅ Track course progress

### 👨‍🏫 **Instructor Features**
- ✅ Create and manage courses
- ✅ Add course details (title, description, duration, difficulty level)
- ✅ Create quizzes for courses
- ✅ Add multiple-choice questions to quizzes
- ✅ Set correct answers and marks
- ✅ View all created courses

### 👨‍💼 **Admin Features**
- ✅ View all users and courses
- ✅ Delete users (except admins)
- ✅ Delete courses
- ✅ Platform moderation and management

### 🔐 **Security Features**
- ✅ Password hashing using bcrypt
- ✅ Session-based authentication
- ✅ Role-based access control (Student, Instructor, Admin)
- ✅ Protected routes with middleware

---

## 🛠️ Tech Stack

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **EJS** - Template engine for server-side rendering

### **Libraries & Tools**
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **mysql2** - MySQL client for Node.js
- **PDFKit** - PDF certificate generation
- **body-parser** - Parse incoming request bodies
- **dotenv** - Environment variable management

### **Frontend**
- **HTML5 & CSS3** - Structure and styling
- **JavaScript** - Client-side interactivity
- **Responsive Design** - Mobile-friendly interface

---

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Student Dashboard
![Student Dashboard](screenshots/student-dashboard.png)

### Quiz Interface
![Quiz](screenshots/quiz.png)

### Certificate
![Certificate](screenshots/certificate.png)

### Instructor Dashboard
![Instructor Dashboard](screenshots/instructor-dashboard.png)

### Admin Panel
![Admin Panel](screenshots/admin-panel.png)

---

## 🚀 Installation

### **Prerequisites**
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/skillbridge.git
cd skillbridge
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Configure Environment Variables**
Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=skillbridge
PORT=3000
SESSION_SECRET=your_secret_key_here
```

---

## 🗄️ Database Setup

### **Step 1: Create Database**
Open MySQL command line or MySQL Workbench and run:

```bash
mysql -u root -p
```

### **Step 2: Import Database Schema**
```bash
mysql -u root -p < database.sql
```

Or manually execute the SQL file:
```sql
source database.sql
```

### **Step 3: Verify Database**
```sql
USE skillbridge;
SHOW TABLES;
SELECT * FROM users;
```

---

## 💻 Usage

### **Start the Server**
```bash
npm start
```

The application will be available at: **http://localhost:3000**

### **For Development (with auto-restart)**
```bash
npm install -g nodemon
nodemon server.js
```

---

## 🔑 Demo Credentials

### **Admin Account**
- **Email:** admin@skillbridge.com
- **Password:** password123

### **Instructor Account**
- **Email:** john@skillbridge.com
- **Password:** password123

### **Student Account**
- **Email:** sarah@skillbridge.com
- **Password:** password123

---

## 📁 Project Structure

```
SkillBridge/
├── certificates/           # Generated PDF certificates
├── config/
│   └── db.js              # Database configuration
├── node_modules/          # Dependencies
├── public/
│   ├── css/
│   │   └── style.css      # Application styles
│   └── js/                # Client-side JavaScript
├── routes/
│   ├── admin.js           # Admin routes
│   ├── auth.js            # Authentication routes
│   ├── instructor.js      # Instructor routes
│   └── student.js         # Student routes
├── views/
│   ├── admin/
│   │   └── dashboard.ejs  # Admin dashboard
│   ├── instructor/
│   │   ├── dashboard.ejs
│   │   ├── create_course.ejs
│   │   ├── course.ejs
│   │   └── create_quiz.ejs
│   ├── student/
│   │   ├── dashboard.ejs
│   │   ├── courses.ejs
│   │   ├── course.ejs
│   │   └── quiz.ejs
│   ├── index.ejs          # Home page
│   ├── login.ejs          # Login page
│   └── register.ejs       # Registration page
├── .env                   # Environment variables
├── database.sql           # Database schema
├── package.json           # Project dependencies
├── server.js              # Main application file
└── README.md              # Project documentation
```

---

## 🌐 API Endpoints

### **Authentication Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/login` | Login page |
| POST | `/auth/login` | Authenticate user |
| GET | `/auth/register` | Registration page |
| POST | `/auth/register` | Create new account |
| GET | `/auth/logout` | Logout user |

### **Student Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/student/dashboard` | Student dashboard |
| GET | `/student/courses` | Browse all courses |
| POST | `/student/enroll/:id` | Enroll in course |
| GET | `/student/course/:id` | View course details |
| GET | `/student/quiz/:id` | Take quiz |
| POST | `/student/quiz/:id/submit` | Submit quiz answers |
| GET | `/student/certificate/:courseId` | Download certificate |

### **Instructor Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/instructor/dashboard` | Instructor dashboard |
| GET | `/instructor/course/create` | Course creation page |
| POST | `/instructor/course/create` | Create new course |
| GET | `/instructor/course/:id` | View course details |
| GET | `/instructor/course/:id/quiz/create` | Quiz creation page |
| POST | `/instructor/course/:id/quiz/create` | Create quiz |

### **Admin Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Admin dashboard |
| POST | `/admin/user/delete/:id` | Delete user |
| POST | `/admin/course/delete/:id` | Delete course |

---

## 📊 Database Schema

### **Users Table**
- id (Primary Key)
- username
- email (Unique)
- password (Hashed)
- role (student/instructor/admin)
- created_at

### **Courses Table**
- id (Primary Key)
- title
- description
- instructor_id (Foreign Key)
- duration
- level (Beginner/Intermediate/Advanced)
- created_at

### **Enrollments Table**
- id (Primary Key)
- student_id (Foreign Key)
- course_id (Foreign Key)
- enrolled_at
- progress
- completed

### **Quizzes Table**
- id (Primary Key)
- course_id (Foreign Key)
- title
- total_marks
- created_at

### **Questions Table**
- id (Primary Key)
- quiz_id (Foreign Key)
- question_text
- option_a, option_b, option_c, option_d
- correct_answer
- marks

### **Quiz Attempts Table**
- id (Primary Key)
- student_id (Foreign Key)
- quiz_id (Foreign Key)
- score
- total_marks
- attempted_at

### **Certificates Table**
- id (Primary Key)
- student_id (Foreign Key)
- course_id (Foreign Key)
- certificate_path
- issued_at

---

## 🔮 Future Enhancements

- [ ] Video lecture uploads and streaming
- [ ] Discussion forums for courses
- [ ] Payment gateway integration
- [ ] Email notifications for enrollments
- [ ] Advanced analytics dashboard
- [ ] Course ratings and reviews
- [ ] Live chat support
- [ ] Mobile application
- [ ] Social media integration
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Course recommendations using AI
