import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../db.json');

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.sendStatus(401); 

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); 
        
        let data = JSON.parse(fs.readFileSync(dbPath));
        const foundUser = data.users.find(u => u.Uid_users === user.id); 
        
        if (!foundUser) return res.status(404).json({ message: 'User not found' });

        req.user = foundUser; 
        next(); 
    });
};