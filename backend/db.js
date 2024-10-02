//db.js

import mysql from 'mysql';

// Create a connection to the MySQL database
export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gym_management'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});
