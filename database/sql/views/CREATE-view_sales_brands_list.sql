CREATE OR REPLACE VIEW view_sales_brands_list AS
SELECT vsd.brand_id as id, vsd.brand_name as name, vsd.supplier_id
FROM view_sale_details vsd
GROUP BY vsd.brand_id;