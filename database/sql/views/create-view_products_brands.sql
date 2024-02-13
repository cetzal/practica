CREATE OR REPLACE VIEW view_products_brands AS
	SELECT 
		vp.brand_id,
		vp.brand_name
	FROM view_products vp
	GROUP BY vp.brand_id