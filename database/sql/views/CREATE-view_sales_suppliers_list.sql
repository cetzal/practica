CREATE OR REPLACE VIEW view_sales_suppliers_list AS
SELECT DISTINCT vsd.supplier_id as id, vsd.supplier_name as name
FROM view_sale_details vsd
WHERE vsd.supplier_id IS NOT NULL;