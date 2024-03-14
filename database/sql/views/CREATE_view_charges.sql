CREATE OR REPLACE VIEW view_charges AS (
SELECT 
	c.id,
	c.account_id,
	(SELECT a.name FROM accounts a WHERE a.id = c.account_id) as account_name,
	c.charge_date,
	(SELECT SUM(cd.amount) FROM charges_detail cd WHERE cd.charge_id = c.id AND cd.deleted_at IS NULL) as amount,
	(SELECT GROUP_CONCAT(DISTINCT vsbys.client_name SEPARATOR ', ') as clients
		FROM view_sales_clients_by_sale vsbys
		WHERE vsbys.sale_id IN (SELECT cd.sale_id FROM charges_detail cd WHERE cd.charge_id = c.id AND cd.deleted_at IS NULL)) AS clients,
	c.created_at,
	c.updated_at,
	c.deleted_at
FROM charges c
WHERE c.deleted_at IS NULL
);