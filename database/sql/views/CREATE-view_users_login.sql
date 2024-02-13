CREATE OR REPLACE  VIEW view_users_login AS 
SELECT 
    vu.id, 
    vu.name, 
    vu.last_name, 
    vu.email, 
    vu.password,
    vu.picture, 
    vu.is_active, 
    vu.role_id,
    vu.role_name, 
    vu.user_parent_id, 
    vu.user_parent_name,
    vu.created_at,
    vu.updated_at,
    vu.deleted_at
FROM 
    view_users vu 
where vu.is_active = true;