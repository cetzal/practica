CREATE OR REPLACE VIEW view_products_brands_list AS
SELECT vb.id, vb.name, vb.supplier_id
FROM view_brands vb 
WHERE vb.id IN (
	SELECT DISTINCT vp.brand_id FROM view_products vp
);