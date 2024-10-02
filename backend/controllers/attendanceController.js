// backend -> controllers -> attendanceController.js

import { db } from '../db.js';

// Mark Attendance
export const markAttendance = async (req, res) => {
  const { userId } = req.body;

  const checkQuery = `
    SELECT id, check_in, check_out 
    FROM attendance 
    WHERE user_id = ? AND DATE(check_in) = CURDATE() AND check_out IS NULL;
  `;

  db.query(checkQuery, [userId], (err, results) => {
    if (results.length > 0) {
      const updateQuery = 'UPDATE attendance SET check_out = NOW() WHERE id = ?';
      db.query(updateQuery, [results[0].id], (err) => {
        return res.status(200).json({ message: 'Checked out successfully' });
      });
    } else {
      const insertQuery = 'INSERT INTO attendance (user_id, check_in) VALUES (?, NOW())';
      db.query(insertQuery, [userId], (err) => {
        return res.status(200).json({ message: 'Checked in successfully' });
      });
    }
  });
};

// Get Count of Users Currently in Gym
export const getAttendanceCount = async (req, res) => {
  const query = 'SELECT COUNT(DISTINCT user_id) as count FROM attendance WHERE check_out IS NULL AND DATE(check_in) = CURDATE();';

  db.query(query, (err, result) => {
    return res.status(200).json({ count: result[0].count });
  });
};
