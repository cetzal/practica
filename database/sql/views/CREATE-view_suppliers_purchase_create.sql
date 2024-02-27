CREATE OR REPLACE VIEW view_suppliers_purchase_create AS
SELECT vsa.id, vsa.name 
FROM view_suppliers_active vsa
WHERE vsa.id in (
	SELECT vpa.supplier_id FROM view_products_active vpa WHERE vpa.brand_id IN (SELECT vba.id FROM view_brands_active vba WHERE vba.id = vpa.brand_id)
);