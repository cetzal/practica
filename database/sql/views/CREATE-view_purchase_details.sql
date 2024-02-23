CREATE OR REPLACE VIEW view_purchase_details AS
SELECT 
	ps.id,
	ps.purchase_date,
	ps.supplier_id,
	(SELECT s.name FROM suppliers AS s WHERE s.id = ps.supplier_id) as supplier_name,
	pd.product_id,
	pr.name as product_name,
	pr.brand_id,
	(SELECT b.name FROM brands AS b WHERE b.id = pr.brand_id) as brand_name,
	pd.qty,
	pd.unit_price,
	pd.total,
	ps.created_at,
	ps.updated_at,
	ps.deleted_at 
FROM purchases ps 
inner join purchases_detail pd on ps.id  = pd.purchase_id
inner join products AS pr ON pd.product_id  = pr.id 
WHERE ps.deleted_at IS NULL;