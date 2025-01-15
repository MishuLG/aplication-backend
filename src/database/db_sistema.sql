select * from users




select * from rols

insert into rols (name_rol, description_rols)
values ('tutor', 'Representante')

SELECT 
    typname AS nombre_tipo,
    enumlabel AS valor_enum
FROM 
    pg_type t
JOIN 
    pg_enum e ON t.oid = e.enumtypid
WHERE 
    typname = 'rol_status';  -- Reemplaza 'nombre_del_enum' con el nombre de tu tipo enum



ALTER TABLE users ADD COLUMN new_uid_users UUID;


UPDATE users SET new_uid_users = gen_random_uuid();

ALTER TABLE users DROP COLUMN uid_users;


ALTER TABLE users RENAME COLUMN new_uid_users TO uid_users;



ALTER TABLE tutors DROP CONSTRAINT tutors_uid_users_fkey;
ALTER TABLE newsletters DROP CONSTRAINT newsletters_uid_users_fkey;


ALTER TABLE tutors 
ADD CONSTRAINT tutors_uid_users_fkey FOREIGN KEY (uid_users) 
REFERENCES users (uid_users);
