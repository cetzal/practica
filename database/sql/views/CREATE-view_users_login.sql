CREATE OR REPLACE  VIEW view_users_login AS 
SELECT 
    vu.id, 
    vu.email, 
    vu.password
FROM 
    view_users vu 
where vu.is_active = true;