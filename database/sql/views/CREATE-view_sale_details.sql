CREATE OR REPLACE VIEW view_sale_details AS
SELECT
	s.id,
	s.date,
	s.client_id,
	(SELECT vc.name FROM view_clients vc WHERE vc.id = s.client_id) as client_name,
	s.status_charge_id,
	(SELECT vsc.name FROM view_status_charge vsc WHERE vsc.id = s.status_charge_id) as status_charge_name,
	sd.id AS sale_detail_id,
	sd.product_id,
	vp.code as product_code,
	vp.name AS product_name,
	vp.brand_id,
	vp.brand_name,
	vp.supplier_id,
	vp.supplier_name,
	sd.quantity,
	sd.unit_price,
	sd.total
FROM sales s
INNER JOIN sale_details sd ON sd.sale_id = s.id
INNER JOIN view_products vp ON vp.id = sd.product_id
WHERE s.deleted_at IS NULL;