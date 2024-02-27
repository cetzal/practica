CREATE OR REPLACE VIEW view_suppliers_sales_create AS
SELECT vsa.id, vsa.name 
FROM view_suppliers_active vsa
WHERE vsa.id in (
	SELECT vpa.supplier_id FROM view_products_active vpa
);