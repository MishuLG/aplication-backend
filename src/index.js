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
import gradesRoutes from './routes/grades.routes.js'; 

dotenv.config();
config();

const app = express();

/*app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));*/

// Aceptamos localhost (para pruebas) y la variable de entorno FRONTEND_URL (para producción)
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL // Aquí pondremos tu link de Vercel más tarde
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (como Postman) o si el origen está en la lista
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Origen bloqueado por CORS:", origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json()); 

// ==========================================
// 🚀 REGISTRO DE RUTAS CORREGIDO (NAMESPACING)
// ==========================================

// Cada módulo tiene su propio prefijo para evitar choques
app.use('/api', userRoutes);           // Antes: /api -> Ahora: /api/users
app.use('/api/students', studentRoutes);     // Antes: /api -> Ahora: /api/students
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/subjects-taken', subjectstakenRoutes);
app.use('/api/school_years', schoolyearRoutes);
app.use('/api/class-schedules', classscheduleRoutes); 
app.use('/api/attendance', attendanceRoutes);
app.use('/api/evaluations', evaluationsRoutes);
app.use('/api/newsletters', newslettersRoutes);
app.use('/api', dashboardRoutes);  // ¡Ahora Dashboard no chocará!
app.use('/api/promotions', promotionRoutes); 
app.use('/api/bulletins', bulletinRoutes);  
app.use('/api/grades', gradesRoutes); 

// ==========================================
// 🔥 DEPURADOR DE ERRORES 🔥
// ==========================================
app.use((err, req, res, next) => {
    console.error("🚨 ERROR:", err.message);
    res.status(500).json({ message: "Error interno del servidor", error: err.message });
});

// --- CONEXIÓN BASE DE DATOS ---
// Agregamos { alter: true } para que actualice las tablas automáticamente
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log("✅ Sequelize conectado, sincronizado y tablas actualizadas.");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error fatal al conectar la BD:", error);
  });