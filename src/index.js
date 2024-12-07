import express from 'express';
import { PORT } from "../config.js"; 
import { config } from 'dotenv';
import userRoutes from "./routes/users.routes.js";
import studentRoutes from "./routes/students.routes.js";
import enrollmentRoutes from "./routes/enrollments.routes.js"
import authRoutes from "./routes/auth.routes.js"

config(); 

const app = express();

app.use(express.json()); 

app.use('/api', userRoutes);
app.use('/api', studentRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});