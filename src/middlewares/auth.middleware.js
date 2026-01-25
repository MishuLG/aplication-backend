import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config.js'; // <--- AQUÍ ESTABA EL ERROR (Faltaba .js)

// Middleware para verificar si es Admin (Rol ID = 1)
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Acceso denegado: Usuario no autenticado." });
    }

    // Verifica el ID del rol (1 = Admin)
    if (req.user.role !== 1) { 
        return res.status(403).json({ 
            message: "Acceso denegado: Se requieren permisos de Administrador." 
        });
    }

    next();
};

// Middleware para verificar roles múltiples
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Acceso denegado: No tienes el rol necesario."
            });
        }
        next();
    };
};