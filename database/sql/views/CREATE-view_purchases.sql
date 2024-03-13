CREATE OR REPLACE VIEW view_purchases AS
SELECT p.id,
	   p.purchase_date,
	   p.supplier_id,
	  (SELECT s.name FROM suppliers s WHERE s.id = p.supplier_id) AS supplier_name,
	  (SELECT SUM(pd.total) FROM purchases_detail pd WHERE pd.purchase_id = p.id) AS total,
	  p.status,
	  p.paid_amounts
FROM purchases p
WHERE deleted_at IS NULL;