CREATE OR REPLACE VIEW view_charges AS (
SELECT 
	c.id,
	c.account_id,
	(SELECT a.name FROM accounts a WHERE a.id = c.account_id) as account_name,
	c.charge_date,
	(SELECT SUM(cd.amount) FROM charges_detail cd WHERE cd.charge_id = c.id AND cd.deleted_at IS NULL) as amount,
	(SELECT GROUP_CONCAT((SELECT c.name FROM clients c WHERE c.id = s.client_id) SEPARATOR ', ') AS client_name
		FROM sales s
		WHERE s.id IN (SELECT cd.sale_id FROM charges_detail cd WHERE cd.charge_id = c.id AND cd.deleted_at IS NULL)) AS clients,
	c.created_at,
	c.updated_at,
	c.deleted_at
FROM charges c
WHERE c.deleted_at IS NULL
);