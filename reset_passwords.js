const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function resetPasswords() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'pass123',
        database: 'skillbridge'
    });

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await connection.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'admin@skillbridge.com']);
    await connection.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'john@skillbridge.com']);
    await connection.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'sarah@skillbridge.com']);
    
    console.log('Passwords reset successfully!');
    console.log('All users now have password: password123');
    
    await connection.end();
}

resetPasswords().catch(console.error);
