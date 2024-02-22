CREATE OR REPLACE VIEW view_sales_suppliers_list AS
SELECT vsd.supplier_id as id, vsd.supplier_name as name
FROM view_sale_details vsd
GROUP BY vsd.supplier_id;