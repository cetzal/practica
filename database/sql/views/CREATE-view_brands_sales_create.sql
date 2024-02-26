CREATE OR REPLACE VIEW view_brands_sales_create AS
SELECT vba.id, vba.name, vba.supplier_id
FROM view_brands_active vba
WHERE vba.id IN(
    SELECT vpa.brand_id
    FROM view_products_active vpa
    WHERE vpa.brand_id = vba.id
) AND vba.supplier_id IN (
	SELECT vsa.id FROM view_suppliers_active vsa WHERE vsa.id = vba.supplier_id
);