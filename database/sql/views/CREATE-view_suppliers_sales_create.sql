CREATE OR REPLACE VIEW view_suppliers_sales_create AS
SELECT vsa.id, vsa.name 
FROM view_suppliers vsa
WHERE vsa.id in (
	SELECT vpa.supplier_id FROM view_products_active vpa
) AND vsa.is_active = 1;