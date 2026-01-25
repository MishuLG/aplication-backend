import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config.js'; // <--- IMPORTANTE: Debe tener .js

export const authenticateToken = (req, res, next) => {
    // 1. Obtener el token del header (Format: "Bearer TOKEN")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Si no hay token, denegar acceso
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado: Token no proporcionado" });
    }

    // 3. Verificar token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido o expirado" });
        }
        
        // 4. Guardar datos del usuario en la request para usarlos luego
        req.user = user; 
        next();
    });
};