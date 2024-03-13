CREATE OR REPLACE VIEW view_payments_delete AS (
SELECT 
	p.id,
	p.account_id,
	(SELECT a.name FROM accounts a WHERE a.id = p.account_id) as account_name,
    p.supplier_id,
    (SELECT vs.name FROM view_suppliers vs WHERE (vs.id = p.supplier_id)) AS supplier_name,
	p.paid_date,
	(SELECT SUM(cd.amount) FROM payments_detail cd WHERE cd.payments_id = p.id) as amount
FROM payments p
);