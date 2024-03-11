CREATE OR REPLACE VIEW view_payments_suppliers_list AS
SELECT DISTINCT vpd.supplier_id as id, vpd.supplier_name as name
FROM view_payments_detail vpd;