import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../database/db.js';
import { SECRET_KEY } from '../../config.js'; // Importante: Importar la clave

// --- LOGIN ---
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña requeridos.' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // FIRMA DEL TOKEN CON LA CLAVE CORRECTA
        const token = jwt.sign(
            { id: user.uid_users, email: user.email, role: user.id_rols }, 
            SECRET_KEY, 
            { expiresIn: '24h' }
        );
        
        res.json({ token, user: { id: user.uid_users, email: user.email, name: user.first_name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// --- OBTENER PERFIL ---
export const getProfile = async (req, res) => {
    const userId = req.user.id; 

    try {
        const query = `
            SELECT 
                uid_users, 
                first_name, 
                last_name, 
                dni, 
                number_tlf, 
                email, 
                TO_CHAR(date_of_birth, 'YYYY-MM-DD') as date_of_birth,
                gender,
                id_rols,
                profile_pic -- Traemos la foto guardada
            FROM users 
            WHERE uid_users = $1
        `;
        const result = await pool.query(query, [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener perfil.' });
    }
};

// --- ACTUALIZAR PERFIL ---
export const updateProfile = async (req, res) => {
    const userId = req.user.id; 
    const { first_name, last_name, number_tlf, password, profile_pic } = req.body;

    if (!first_name || !last_name || !number_tlf) {
        return res.status(400).json({ message: 'Nombre, apellido y teléfono son obligatorios.' });
    }

    try {
        let query;
        let params;

        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `
                UPDATE users SET 
                    first_name = $1, 
                    last_name = $2, 
                    number_tlf = $3,
                    password = $4,
                    profile_pic = COALESCE($5, profile_pic),
                    updated_at = CURRENT_DATE
                WHERE uid_users = $6 RETURNING first_name, last_name, email, profile_pic;
            `;
            params = [first_name, last_name, number_tlf, hashedPassword, profile_pic, userId];
        } else {
            query = `
                UPDATE users SET 
                    first_name = $1, 
                    last_name = $2, 
                    number_tlf = $3,
                    profile_pic = COALESCE($4, profile_pic),
                    updated_at = CURRENT_DATE
                WHERE uid_users = $5 RETURNING first_name, last_name, email, profile_pic;
            `;
            params = [first_name, last_name, number_tlf, profile_pic, userId];
        }

        const result = await pool.query(query, params);
        res.json({ message: 'Perfil actualizado correctamente.', user: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar perfil.' });
    }
};

export const logout = (req, res) => {
    res.json({ message: 'Sesión cerrada correctamente' });
};

// --- RECUPERACIÓN DE CONTRASEÑA ---
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = jwt.sign({ id: user.uid_users }, process.env.JWT_SECRET, { expiresIn: '15m' });
        
        console.log(`Código de recuperación enviado al correo ${email}: ${resetToken}`);

        res.json({ message: 'Password reset token generated. Check your email.', resetToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }

    try {
        jwt.verify(resetToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const result = await pool.query(
                'UPDATE users SET password = $1 WHERE uid_users = $2 RETURNING *',
                [hashedPassword, decoded.id]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'Password reset successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};