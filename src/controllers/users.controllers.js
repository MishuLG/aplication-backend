import { pool } from '../database/db.js'; 


const generateUid = async () => {
    const { rows } = await pool.query('SELECT MAX(uid_users) AS maxUid FROM users');
    return (rows[0].maxUid || 0) + 1; 
};

export const getAllUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving the users' });
    }
};

export const getUserById = async (req, res) => {
    const { idUser } = req.params; 
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE uid_users = $1', [idUser]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

export const createUser = async (req, res) => {
    const { id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender, status = true } = req.body;

    
    if (!id_rols || !first_name || !last_name || !dni || !number_tlf || !email || !password || !date_of_birth || !gender) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    
    const roleId = parseInt(id_rols, 10);
    
    
    if (isNaN(roleId)) {
        return res.status(400).json({ message: 'id_rols must be a valid integer' });
    }

    try {
        
        const uid_user = await generateUid();

        const result = await pool.query(
            `INSERT INTO users (uid_users, id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender, created_at, updated_at, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW(), $11) RETURNING *`, 
            [uid_user, roleId, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

export const deleteUserById = async (req, res) => {
    const { idUser } = req.params;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        
        await client.query('DELETE FROM teams WHERE id_td = $1', [idUser]);
        await client.query('DELETE FROM admins WHERE uid_users = $1', [idUser]);
        await client.query('DELETE FROM technical_directors WHERE uid_users = $1', [idUser]);
        await client.query('DELETE FROM treasurers WHERE uid_users = $1', [idUser]);

        const { rows, rowCount } = await client.query('DELETE FROM users WHERE uid_users = $1 RETURNING *', [idUser]);

        if (rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'User not found' });
        }

        await client.query('COMMIT');

        res.json({ message: 'User deleted successfully', user: rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    } finally {
        client.release();
    }
};

export const updateUserById = async (req, res) => {
    const { idUser } = req.params;
    const { id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender } = req.body;

    
    if (!first_name && !last_name && !dni && !number_tlf && !email && !password && !date_of_birth && !gender) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    
    let roleId;
    if (id_rols !== undefined) {
        roleId = parseInt(id_rols);
        
        if (isNaN(roleId)) {
            return res.status(400).json({ message: 'id_rols must be a valid integer' });
        }
    }

    try {
        const { rows } = await pool.query(
            `UPDATE users SET 
                id_rols = COALESCE($1,id_rols), 
                first_name = COALESCE($2,last_name), 
                last_name = COALESCE($3,last_name), 
                dni = COALESCE($4,dni),
                number_tlf = COALESCE($5,numer_tlf),
                email = COALESCE($6,email),
                password = COALESCE($7,password),
                date_of_birth = COALESCE($8,date_of_birth),
                gender = COALESCE($9,gender),
                updated_at = NOW()
             WHERE uid_users = $10 RETURNING *`, 
            [roleId || null,
             first_name || null,
             last_name || null,
             dni || null,
             number_tlf || null,
             email || null,
             password || null,
             date_of_birth || null,
             gender || null,
             idUser]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user' });
    }
};
