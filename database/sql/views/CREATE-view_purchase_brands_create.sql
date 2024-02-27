CREATE OR REPLACE VIEW view_brands_purchase_create AS
SELECT vba.id, vba.name, vba.supplier_id
FROM view_brands_active AS vba
WHERE vba.id IN(
    SELECT vpa.brand_id
    FROM view_products_active AS vpa
    GROUP BY vpa.brand_id
) AND vba.supplier_id IN (
	SELECT vsa.id FROM view_suppliers_active vsa WHERE vsa.id = vba.supplier_id
);
