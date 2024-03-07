CREATE OR REPLACE VIEW view_accounts AS
SELECT 
	a.id,
	a.name,
    a.init_balance,
	a.is_active,
	(SELECT CONCAT(u.name, ' ', u.last_name) FROM users AS u WHERE u.id = c.user_id) as created_by,
	a.created_at,
	a.updated_at,
FROM accounts as a
WHERE  deleted_at IS NULL;