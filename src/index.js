import express from 'express';
import { PORT } from "../config.js"; 
import { config } from 'dotenv';
import userRoutes from "./routes/users.routes.js";
import studentRoutes from "./routes/students.routes.js";
import enrollmentRoutes from "./routes/enrollments.routes.js"
import authRoutes from "./routes/auth.routes.js"
import tutorRoutes from './routes/tutors.routes.js';
import sectionsRoutes from './routes/sections.routes.js'
import subjectsRoutes from './routes/subjects.routes.js'
import subjectstakenRoutes from './routes/subjectsTaken.routes.js'
import classscheduleRoutes from './routes/classSchedules.routes.js'
import attendanceRoutes from './routes/attendance.routes.js'
import dotenv from 'dotenv';
dotenv.config();

config(); 

const app = express();

app.use(express.json()); 

app.use('/api', userRoutes);
app.use('/api', studentRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', tutorRoutes);
app.use('/api', sectionsRoutes);
app.use('/api', subjectsRoutes);
app.use('/api', subjectstakenRoutes);
app.use('/api', classscheduleRoutes);
app.use('/api', attendanceRoutes);

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});