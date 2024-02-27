CREATE OR REPLACE VIEW view_sale_details AS
SELECT
	s.id,
	s.date,
	s.client_id,
	(SELECT vc.name FROM view_clients vc WHERE vc.id = s.client_id) as client_name,
	sd.id AS sale_detail_id,
	sd.product_id,
	vp.code as product_code,
	vp.name AS product_name,
	vb.id as brand_id,
	vb.name AS brand_name,
	vb.supplier_id,
	(SELECT vs.name FROM view_suppliers vs WHERE vs.id = vb.supplier_id) as supplier_name,
	sd.quantity,
	sd.unit_price,
	sd.total
FROM sales s
INNER JOIN sale_details sd ON sd.sale_id = s.id
INNER JOIN view_products vp ON vp.id = sd.product_id
INNER JOIN view_brands vb ON vb.id = vp.brand_id;