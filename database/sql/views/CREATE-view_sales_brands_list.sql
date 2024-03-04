CREATE OR REPLACE VIEW view_sales_brands_list AS
SELECT DISTINCT vsd.brand_id as id, vsd.brand_name as name, vsd.supplier_id
FROM view_sale_details vsd;