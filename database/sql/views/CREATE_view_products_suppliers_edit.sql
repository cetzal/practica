CREATE OR REPLACE VIEW view_products_suppliers_edit AS
SELECT s.id, s.name, s.is_active
FROM suppliers s
WHERE s.id IN (
	SELECT vp.supplier_id FROM view_products vp
)
GROUP BY s.id;