CREATE OR REPLACE VIEW view_charges_sales_search AS
SELECT
	vs.id,
   	vs.sale_date,
   	vs.client_id,
  	vs.client_name,
  	(total - total_charged) as total,
  	vs.status_charge_id,
  	(SELECT vsc.name FROM view_status_charge vsc WHERE vsc.id = vs.status_charge_id) as status_charge_name,
  	vs.total_charged
FROM view_sales vs;