const express = require('express');
const mysql = require('mysql2');
const app = express();

const dbConfig = {
    host: 'ankit-db.coro28ea060l.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'AnkitPassword123',
    database: 'ankitdb',
    connectTimeout: 10000 // 10 seconds timeout
};

app.get('/', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    
    connection.connect((err) => {
        if (err) {
            return res.status(500).send("<h1>Connection Failed</h1><p>" + err.message + "</p>");
        }
        
        connection.query('SELECT * FROM users LIMIT 1', (err, results) => {
            connection.end();
            if (err) return res.status(500).send("Query Error: " + err.message);
            
            const user = results[0] || { name: 'No Data', role: 'No Data' };
            res.send(`<h1>Ankit's AI Dashboard (Docker Live)</h1>
                      <p><b>User:</b> ${user.name}</p>
                      <p><b>Role:</b> ${user.role}</p>
                      <p>Status: Successfully connected to RDS!</p>`);
        });
    });
});

app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));
