import express from 'express';
import { PORT } from "../config.js"; 
import { config } from 'dotenv';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from "./database/sequelize.js";  

// --- IMPORTACIÓN DE RUTAS ---
import userRoutes from "./routes/users.routes.js";
import studentRoutes from "./routes/students.routes.js";
import enrollmentRoutes from "./routes/enrollments.routes.js";
import authRoutes from "./routes/auth.routes.js";
import tutorRoutes from './routes/tutors.routes.js';
import sectionsRoutes from './routes/sections.routes.js';
import subjectsRoutes from './routes/subjects.routes.js';
import subjectstakenRoutes from './routes/subjectsTaken.routes.js';
import schoolyearRoutes from './routes/schoolYear.routes.js';
import classscheduleRoutes from './routes/classSchedules.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import evaluationsRoutes from './routes/evaluations.routes.js';
import newslettersRoutes from './routes/newsletters.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import promotionRoutes from './routes/promotion.routes.js'; 
import bulletinRoutes from './routes/bulletin.routes.js';   
import gradesRoutes from './routes/grades.routes.js'; // Ruta de Notas

dotenv.config();
config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json()); 

// --- REGISTRO DE RUTAS ESTANDARIZADO ---

// Rutas Generales
app.use('/api', userRoutes);
app.use('/api', studentRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', tutorRoutes);
app.use('/api', sectionsRoutes);
app.use('/api', subjectsRoutes);
app.use('/api', subjectstakenRoutes);

// CORRECCIÓN: Rutas con Prefijo Específico (Soluciona el 404)
app.use('/api/school_years', schoolyearRoutes);     // <--- ¡AQUÍ ESTÁ LA SOLUCIÓN!
app.use('/api/class-schedules', classscheduleRoutes); 
app.use('/api/attendance', attendanceRoutes);

// Resto de rutas
app.use('/api', evaluationsRoutes);
app.use('/api', newslettersRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', promotionRoutes); 
app.use('/api', bulletinRoutes);  
app.use('/api', gradesRoutes); 

// --- CONEXIÓN BASE DE DATOS ---
sequelize.sync() 
  .then(() => {
    console.log("Sequelize connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });