CREATE OR REPLACE VIEW view_sales_clients_list AS
SELECT DISTINCT vsd.client_id as id, vsd.client_name as name
FROM view_sale_details vsd
WHERE vsd.status_charge_id <> 1;