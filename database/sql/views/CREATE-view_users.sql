CREATE OR REPLACE  VIEW view_users AS
    SELECT 
        u.id, 
        u.name, 
        u.last_name, 
        u.email, 
        u.password,
        u.picture, 
        u.is_active, 
        u.role_id,
        (SELECT r.name FROM roles AS r WHERE r.id = u.role_id) AS role_name, 
        u.user_parent_id, 
        CONCAT(u2.name, ' ', u2.last_name) AS user_parent_name,
        u.created_at,
        u.updated_at,
        u.deleted_at
    FROM 
        users u
    LEFT JOIN users u2 ON u.user_parent_id = u2.id
    WHERE u.deleted_at IS NULL;