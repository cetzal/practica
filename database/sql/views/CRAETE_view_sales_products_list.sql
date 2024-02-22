CREATE OR REPLACE VIEW view_sales_products_list AS
SELECT vsd.product_id as id, vsd.product_name as name, vsd.brand_id
FROM view_sale_details vsd
GROUP BY vsd.product_id;