CREATE OR REPLACE 
VIEW view_users_login AS
SELECT 
    vu.email, vu.password
FROM 
    view_users as vu
WHERE 
    vu.is_active = 1;