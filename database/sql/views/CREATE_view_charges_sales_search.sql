CREATE OR REPLACE VIEW view_charges_sales_search AS
SELECT
	id,
   	sale_date,
   	client_id,
  	client_name,
  	(total - total_charged) as total,
  	status,
  	total_charged
FROM view_sales;