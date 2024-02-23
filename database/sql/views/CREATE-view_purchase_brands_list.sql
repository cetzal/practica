CREATE OR REPLACE VIEW view_purchase_brands_list AS
SELECT vpd.brand_id as id, vpd.brand_name as name, vpd.supplier_id
FROM view_purchase_details vpd
GROUP BY vpd.brand_id, vpd.supplier_id;