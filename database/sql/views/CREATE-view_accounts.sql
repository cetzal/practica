CREATE OR REPLACE VIEW view_accounts AS
SELECT 
	a.id,
	a.name,
    a.init_balance,
	a.is_active,
	(SELECT CONCAT(u.name, ' ', u.last_name) FROM users AS u WHERE u.id = a.user_id) as created_by,
	(SELECT SUM(vc.amount) FROM view_charges vc WHERE vc.account_id = a.id) AS revenue,
	(a.init_balance + COALESCE((SELECT SUM(vc.amount) FROM view_charges vc WHERE vc.account_id = a.id), 0)) AS balance,
	a.created_at,
	a.updated_at
FROM accounts as a
WHERE  deleted_at IS NULL;