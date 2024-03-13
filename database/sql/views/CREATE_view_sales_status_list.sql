CREATE OR REPLACE VIEW view_sales_status_list AS
SELECT DISTINCT vs.status_charge_name as id, vs.status_charge_name as name
FROM view_sales vs;
