CREATE OR REPLACE VIEW view_products_sales_create AS
	SELECT vpa.id, vpa. name, vpa.code, vpa.qty, vpa.price, vpa.alert_quantity, vpa.brand_id, vpa.supplier_id
	FROM view_products_active vpa 
	WHERE vpa.brand_id in (
		SELECT vba.id FROM view_brands_active vba WHERE vba.supplier_id IN (SELECT vsa.id FROM view_suppliers_active vsa)
	) AND vpa.price > 0;