// backend -> index.js

import express from 'express';
import userRoutes from './routs/userrouts.js';
import attendanceRoutes from './routs/attendanceRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use((req, res, next) => {
  return res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
