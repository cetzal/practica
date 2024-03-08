CREATE OR REPLACE VIEW view_payments_detail AS
SELECT 
	vp.id,
	vp.account_name,
	vp.supplier_name,
	(SELECT vp.purchase_date FROM view_purchases vp WHERE vp.id = pd.purchase_id) as purchase_date,
	pd.amount,
	pd.payments_id,
	pd.purchase_id
FROM view_payments vp
INNER JOIN payments_detail pd ON vp.id = pd.payments_id 