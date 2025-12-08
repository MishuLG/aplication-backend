import {
    createUserModel,
    validateProfessorModel,
    getUsersByRoleModel,
    deleteUserByIdModel,
    updateUserByIdModel,
    getUserByIdModel,
    getAllUsersModel,
    checkDuplicateUser
} from '../models/users.model.js';

// --- Helpers de Validación ---
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidDNI = (dni) => /^\d+$/.test(dni) && dni.length >= 6;

// Función exacta para calcular edad
const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// --- Controladores ---

export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersModel();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserByIdModel(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
};

export const createUser = async (req, res) => {
    const { id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender } = req.body;

    // 1. Validar campos obligatorios
    if (!id_rols || !first_name || !last_name || !dni || !email || !password || !date_of_birth || !gender) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // 2. Validaciones de Edad y Fecha
    const birthDate = new Date(date_of_birth);
    const today = new Date();
    
    // Normalizar horas para comparar solo fechas (evita errores por hora del servidor)
    today.setHours(0,0,0,0);
    birthDate.setHours(0,0,0,0);

    if (birthDate > today) {
        return res.status(400).json({ message: 'La fecha de nacimiento no puede ser futura.' });
    }
    
    if (calculateAge(date_of_birth) < 21) {
        return res.status(400).json({ message: 'El usuario debe ser mayor de 21 años para registrarse.' });
    }

    // 3. Validaciones de Formato
    if (!isValidEmail(email)) return res.status(400).json({ message: 'Email inválido.' });
    if (!isValidDNI(dni)) return res.status(400).json({ message: 'DNI inválido (solo números).' });
    if (password.length < 6) return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });

    try {
        // 4. Validar Duplicados
        const isDuplicate = await checkDuplicateUser(email, dni);
        if (isDuplicate) return res.status(409).json({ message: 'El Email o DNI ya están registrados.' });

        const user = await createUserModel(req.body);
        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno al crear usuario', error: error.message });
    }
};

export const updateUserById = async (req, res) => {
    const { id } = req.params;
    const { id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender } = req.body;

    // 1. Validar campos obligatorios mínimos
    if (!id_rols || !first_name || !last_name || !dni || !email || !date_of_birth) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para actualizar.' });
    }

    // 2. Validaciones de Edad y Fecha
    const birthDate = new Date(date_of_birth);
    const today = new Date();
    today.setHours(0,0,0,0);
    birthDate.setHours(0,0,0,0);

    if (birthDate > today) {
        return res.status(400).json({ message: 'La fecha de nacimiento no puede ser futura.' });
    }
    if (calculateAge(date_of_birth) < 21) {
        return res.status(400).json({ message: 'El usuario debe ser mayor de 21 años.' });
    }

    // 3. Validaciones de Formato
    if (!isValidEmail(email)) return res.status(400).json({ message: 'Email inválido.' });
    if (!isValidDNI(dni)) return res.status(400).json({ message: 'DNI inválido.' });
    
    // Validar contraseña solo si se envía
    if (password && password.trim() !== '') {
        if (password.length < 6) return res.status(400).json({ message: 'La nueva contraseña es muy corta.' });
    }

    try {
        // 4. Validar Duplicados (excluyendo al usuario actual)
        const isDuplicate = await checkDuplicateUser(email, dni, id);
        if (isDuplicate) return res.status(409).json({ message: 'El Email o DNI pertenecen a otro usuario.' });

        const user = await updateUserByIdModel(id, req.body);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario actualizado correctamente', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

export const deleteUserById = async (req, res) => {
    const { id } = req.params;

    // --- PROTECCIÓN: No auto-eliminarse ---
    // Verificamos si el usuario intenta borrarse a sí mismo comparando con el token (req.user)
    if (req.user && req.user.id === id) {
        return res.status(403).json({ message: 'No puedes eliminar tu propia cuenta mientras estás conectado.' });
    }

    try {
        const user = await deleteUserByIdModel(id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado correctamente', user });
    } catch (error) {
        console.error(error);
        if (error.code === '23503') return res.status(409).json({ message: 'No se puede eliminar: El usuario tiene roles o datos asociados.' });
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};

// Controladores adicionales
export const validateProfessor = async (req, res) => {
    const { uid_users } = req.params;
    try {
        const user = await validateProfessorModel(uid_users);
        if (!user) return res.status(404).json({ message: 'Profesor no encontrado' });
        res.json({ message: 'Profesor validado', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al validar profesor' });
    }
};

export const getUsersByRole = async (req, res) => {
    const { role } = req.params;
    try {
        const users = await getUsersByRoleModel(role);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios por rol' });
    }
};

// Exportar todo
export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
    validateProfessor,
    getUsersByRole
};