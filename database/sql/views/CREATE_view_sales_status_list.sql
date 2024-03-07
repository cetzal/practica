CREATE OR REPLACE VIEW view_sales_status_list AS
SELECT DISTINCT vs.status as id, vs.status as name
FROM view_sales vs;