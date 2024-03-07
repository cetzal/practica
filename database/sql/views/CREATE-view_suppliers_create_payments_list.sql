CREATE OR REPLACE VIEW view_suppliers_create_payments_list AS
SELECT vsa.id, vsa.name 
FROM view_suppliers_active vsa
WHERE vsa.id in (
	SELECT DISTINCT vp.supplier_id FROM view_purchases vp 
);
