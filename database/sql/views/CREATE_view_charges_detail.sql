CREATE OR REPLACE VIEW view_charges_detail AS
SELECT 
	cd.id,
	cd.charge_id,
	vc.charge_date,
	vc.account_id,
	vc.account_name,
	cd.sale_id,
	vs.client_id,
	vs.client_name,
	cd.amount,
	vc.created_at,
	vc.updated_at,
	vc.deleted_at
FROM charges_detail cd
JOIN view_charges vc ON vc.id = cd.charge_id
JOIN view_sales vs ON vs.id = cd.sale_id;