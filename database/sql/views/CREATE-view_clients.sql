CREATE OR REPLACE VIEW view_clients AS
SELECT 
	c.id,
	c.name,
	c.is_active,
	(SELECT CONCAT(u.name, ' ', u.last_name) FROM users AS u WHERE u.id = c.user_id) as created_by,
	c.created_at,
	c.updated_at,
	c.deleted_at
FROM clients as c
WHERE  deleted_at IS NULL;