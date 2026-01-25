import express from 'express';
import { PORT } from "../config.js"; 
import { config } from 'dotenv';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from "./database/sequelize.js";  

// --- IMPORTACIÓN DE RUTAS EXISTENTES ---
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

// --- IMPORTACIÓN DE RUTAS NUEVAS (AJUSTES) ---
import promotionRoutes from './routes/promotion.routes.js'; 
import bulletinRoutes from './routes/bulletin.routes.js';   
import gradesRoutes from './routes/grades.routes.js'; // <--- AGREGAR ESTO (Importar la ruta)

dotenv.config();
config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json()); 

// --- REGISTRO DE RUTAS ---
app.use('/api', userRoutes);
app.use('/api', studentRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', tutorRoutes);
app.use('/api', sectionsRoutes);
app.use('/api', subjectsRoutes);
app.use('/api', schoolyearRoutes);
app.use('/api', subjectstakenRoutes);
app.use('/api', classscheduleRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', evaluationsRoutes);
app.use('/api', newslettersRoutes);
app.use('/api', dashboardRoutes);

// --- REGISTRO DE RUTAS NUEVAS ---
app.use('/api', promotionRoutes); 
app.use('/api', bulletinRoutes);  
app.use('/api', gradesRoutes); // <--- AGREGAR ESTO (Activar la ruta en el servidor)

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