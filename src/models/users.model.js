import { pool } from '../database/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// --- NUEVA FUNCIÓN: Verificar Duplicados (Email o DNI) ---
// Esta es la función que te faltaba y causaba el error
export const checkDuplicateUser = async (email, dni, excludeId = null) => {
    let query = `
        SELECT uid_users 
        FROM users 
        WHERE (email = $1 OR dni = $2)
    `;
    const params = [email, dni];

    if (excludeId) {
        query += ` AND uid_users != $3`;
        params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
};

export const getAllUsersModel = async () => {
    const query = `
        SELECT uid_users, id_rols, first_name, last_name, dni, number_tlf, email, 
               TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth, 
               gender, status, 
               TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at, 
               TO_CHAR(updated_at, 'YYYY-MM-DD') AS updated_at
        FROM users
        ORDER BY created_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getUserByIdModel = async (id) => {
    const query = `
        SELECT uid_users, id_rols, first_name, last_name, dni, number_tlf, email, 
               TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth, 
               gender, status, 
               TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at, 
               TO_CHAR(updated_at, 'YYYY-MM-DD') AS updated_at
        FROM users WHERE uid_users = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const createUserModel = async (userData) => {
    const { id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender, status = 'active' } = userData;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const uid = generateUid();

    const query = `
        INSERT INTO users (uid_users, id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender, created_at, updated_at, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE, CURRENT_DATE, $11) RETURNING *;
    `;
    
    const result = await pool.query(query, [
        uid, id_rols, first_name, last_name, dni, number_tlf, email, hashedPassword, date_of_birth, gender, status
    ]);

    return result.rows[0];
};

export const updateUserByIdModel = async (id, userData) => {
    const { id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender, status } = userData;

    // Solo actualizar contraseña si viene una nueva
    let passwordHash = null;
    if (password && password.trim() !== '') {
        passwordHash = bcrypt.hashSync(password, 10);
    }

    const query = `
        UPDATE users SET 
            id_rols = COALESCE($1, id_rols), 
            first_name = COALESCE($2, first_name), 
            last_name = COALESCE($3, last_name), 
            dni = COALESCE($4, dni),
            number_tlf = COALESCE($5, number_tlf),
            email = COALESCE($6, email),
            password = COALESCE($7, password),
            date_of_birth = COALESCE($8, date_of_birth),
            gender = COALESCE($9, gender),
            status = COALESCE($10, status),
            updated_at = CURRENT_DATE
        WHERE uid_users = $11 RETURNING *;
    `;
    const result = await pool.query(query, [
        id_rols, first_name, last_name, dni, number_tlf, email, 
        passwordHash, 
        date_of_birth, gender, status, id
    ]);

    return result.rows[0];
};

// Asegúrate de que 'pool' esté importado arriba: import { pool } from '../database/db.js';

export const deleteUserByIdModel = async (uid_users) => {
  // Usamos 'client' en lugar de 'pool' directo para poder hacer una Transacción
  const client = await pool.connect(); 
  
  try {
    await client.query('BEGIN'); // Iniciamos la transacción (Todo o nada)

    // PASO 1: Eliminar primero la dependencia en la tabla 'tutors'
    // Esto quita el candado de la llave foránea
    await client.query('DELETE FROM tutors WHERE uid_users = $1', [uid_users]);

    // PASO 2: Eliminar al usuario de la tabla 'users'
    const response = await client.query('DELETE FROM users WHERE uid_users = $1 RETURNING *', [uid_users]);

    await client.query('COMMIT'); // Guardamos los cambios
    return response.rows[0];

  } catch (error) {
    await client.query('ROLLBACK'); // Si algo falla, deshacemos todo
    throw error;
  } finally {
    client.release(); // Liberamos la conexión
  }
};

// Funciones auxiliares
export const validateProfessorModel = async (uid_users) => {
    const query = `UPDATE users SET status = 'active', updated_at = CURRENT_DATE WHERE uid_users = $1 AND id_rols = 2 RETURNING *;`;
    const result = await pool.query(query, [uid_users]);
    return result.rows[0];
};

export const getUsersByRoleModel = async (id_rols) => {
    const query = `SELECT uid_users, first_name, last_name, email FROM users WHERE id_rols = $1;`;
    const result = await pool.query(query, [id_rols]);
    return result.rows;
};

const generateUid = () => uuidv4();