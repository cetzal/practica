CREATE OR REPLACE VIEW view_suppliers_purchase_create AS
SELECT vsa.id, vsa.name 
FROM view_suppliers_active vsa
WHERE vsa.id in (
	SELECT DISTINCT vpa.supplier_id 
	FROM view_products_active vpa 
)