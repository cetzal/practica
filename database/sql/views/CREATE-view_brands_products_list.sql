CREATE OR REPLACE VIEW view_brands_products_list AS
SELECT b.id, b.name, b. supplier_id
FROM brands b
WHERE b.id IN(
	SELECT DISTINCT brand_id
	FROM view_products
);