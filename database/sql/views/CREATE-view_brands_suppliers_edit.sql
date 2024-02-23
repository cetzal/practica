CREATE OR REPLACE VIEW view_brands_suppliers_edit AS
SELECT s.id, s.name, s.is_active
FROM suppliers s
WHERE s.id IN (
	SELECT vb.supplier_id FROM view_brands vb
)
GROUP BY s.id;