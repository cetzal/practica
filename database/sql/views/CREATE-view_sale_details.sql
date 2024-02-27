CREATE OR REPLACE VIEW view_sale_details AS
SELECT
	s.id,
	s.date,
	s.client_id,
	(SELECT c.name FROM clients c WHERE c.id = s.client_id) as client_name,
	sd.id AS sale_detail_id,
	sd.product_id,
	p.code as product_code,
	p.name AS product_name,
	b.id as brand_id,
	b.name AS brand_name,
	b.supplier_id,
	(SELECT s.name FROM suppliers s WHERE s.id = b.supplier_id) as supplier_name,
	sd.quantity,
	sd.unit_price,
	sd.total
FROM sales s
INNER JOIN sale_details sd ON sd.sale_id = s.id
INNER JOIN products p ON p.id = sd.product_id
INNER JOIN brands b ON b.id = p.brand_id;