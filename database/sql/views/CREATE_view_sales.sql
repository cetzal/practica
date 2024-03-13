CREATE OR REPLACE VIEW view_sales AS
SELECT s.id,
	   s.date AS sale_date,
	   s.client_id,
	  (SELECT c.name FROM clients c WHERE c.id = s.client_id) AS client_name,
	  (SELECT SUM(sd.total) FROM sale_details sd WHERE sd.sale_id = s.id) AS total,
	  s.status_charge_id,
	  (SELECT vsc.name FROM view_status_charge vsc WHERE vsc.id = s.status_charge_id) as status_charge_name,
	  s.total_charged
FROM sales s
WHERE s.deleted_at IS NULL;