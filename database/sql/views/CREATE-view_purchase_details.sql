CREATE OR REPLACE VIEW view_purchase_details AS
SELECT 
	ps.id,
	vpr.code,
	ps.purchase_date,
	ps.supplier_id,
	(SELECT s.name FROM view_suppliers AS s WHERE s.id = ps.supplier_id) as supplier_name,
	pd.product_id,
	vpr.name as product_name,
	vpr.brand_id,
	(SELECT b.name FROM view_brands AS b WHERE b.id = vpr.brand_id) as brand_name,
	pd.qty,
	pd.unit_price,
	pd.total,
	ps.created_at,
	ps.updated_at,
	ps.deleted_at 
FROM purchases ps 
inner join purchases_detail pd on ps.id  = pd.purchase_id
inner join view_products AS vpr ON pd.product_id  = vpr.id 
WHERE ps.deleted_at IS NULL;