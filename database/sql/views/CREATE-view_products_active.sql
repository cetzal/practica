CREATE OR REPLACE VIEW view_products_active AS
	SELECT id, name, brand_id
	FROM view_products
	WHERE is_active = 1;