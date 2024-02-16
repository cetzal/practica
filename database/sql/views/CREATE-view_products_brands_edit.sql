CREATE OR REPLACE VIEW view_products_brands_edit AS 
	SELECT p.brand_id AS id, b.name
	FROM products p 
	INNER JOIN brands b ON b.id = p.brand_id
	WHERE b.is_active = 1 OR b.deleted_at IS NOT NULL
	GROUP BY p.brand_id, b.name;