CREATE OR REPLACE VIEW view_purchase_details AS
SELECT 
	ps.id,
	ps.purchase_date as date,
	ps.supplier_id,
	vp.supplier_name,
	pd.product_id,
	vp.code as product_code,
	vp.name as product_name,
	vp.brand_id,
	vp.brand_name,
	pd.qty,
	pd.unit_price,
	pd.total,
	ps.created_at,
	ps.updated_at,
	ps.deleted_at 
FROM purchases ps 
inner join purchases_detail pd on ps.id  = pd.purchase_id
inner join view_products AS vp ON pd.product_id  = vp.id 
