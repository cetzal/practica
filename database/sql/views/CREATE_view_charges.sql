CREATE OR REPLACE VIEW view_charges AS (
SELECT 
	c.id,
	c.account_id,
	(SELECT a.name FROM accounts a WHERE a.id = c.account_id) as account_name,
	c.charge_date,
	(SELECT SUM(cd.amount) FROM charges_detail cd WHERE cd.charge_id = c.id) as amount,
	c.created_at,
	c.updated_at,
	c.deleted_at
FROM charges c
WHERE c.deleted_at IS NULL
);