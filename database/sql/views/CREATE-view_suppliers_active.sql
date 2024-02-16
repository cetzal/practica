CREATE OR REPLACE VIEW view_suppliers_active AS
SELECT 
	vs.id,
	vs.name
FROM view_suppliers AS vs
WHERE vs.is_active = TRUE;