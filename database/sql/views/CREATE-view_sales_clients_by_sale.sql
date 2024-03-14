CREATE OR REPLACE VIEW view_sales_clients_by_sale AS
SELECT s.id as sale_id, s.client_id, (SELECT c.name FROM clients c WHERE c.id = s.client_id) AS client_name
FROM sales s
ORDER BY client_name ASC;