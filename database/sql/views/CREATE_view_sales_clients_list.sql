CREATE OR REPLACE VIEW view_sales_clients_list AS
SELECT vsd.client_id as id, vsd.client_name as name
FROM view_sale_details vsd
GROUP BY vsd.client_id;