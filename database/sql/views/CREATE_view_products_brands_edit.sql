CREATE OR REPLACE VIEW view_products_brands_edit AS
SELECT b.id, b.name, b.supplier_id, b.is_active
FROM brands b
WHERE b.id IN (
	SELECT vp.brand_id FROM view_products vp
)
GROUP BY b.id;