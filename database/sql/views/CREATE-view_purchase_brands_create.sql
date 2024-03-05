CREATE OR REPLACE VIEW view_brands_purchase_create AS
SELECT vba.id, vba.name, vba.supplier_id
FROM view_brands_active AS vba
WHERE vba.id IN(
    SELECT DISTINCT vpa.brand_id
    FROM view_products_active AS vpa
) AND vba.supplier_id IN (
	SELECT vsa.id FROM view_suppliers_active vsa
);