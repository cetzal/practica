CREATE OR REPLACE VIEW view_products_brands AS
	SELECT 
		DISTINCT vp.brand_id,
		vp.brand_name
	FROM view_products vp;