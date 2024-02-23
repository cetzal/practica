CREATE OR REPLACE VIEW view_purchase_suppliers_list AS
SELECT vpd.supplier_id as id, vpd.supplier_name as name
FROM view_purchase_details vpd
GROUP BY vpd.supplier_id;