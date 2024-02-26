	CREATE OR REPLACE VIEW view_products_sales_create AS
	SELECT vpa.id,  vpa.name, vpa.brand_id
	FROM view_products_active vpa 
	WHERE vpa.brand_id in (
		SELECT vbsc.id FROM view_brands_sales_create vbsc WHERE vbsc.id = vpa.brand_id
	)