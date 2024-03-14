CREATE OR REPLACE VIEW view_purchases_create_payments AS
SELECT vp.id,
	   vp.purchase_date,
	   vp.supplier_id,
	   vp.supplier_name,
	   (vp.total - vp.paid_amounts) as total,
	   vp.status,
	  vp.paid_amounts
FROM view_purchases vp 
WHERE vp.status != 2;