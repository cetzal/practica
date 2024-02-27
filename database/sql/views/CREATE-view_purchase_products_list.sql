CREATE OR REPLACE VIEW view_purchase_products_list AS
SELECT vpd.product_id as id, vpd.product_name as name, vpd.brand_id, vpd.supplier_id
FROM view_purchase_details vpd
GROUP BY vpd.product_id, vpd.supplier_id;