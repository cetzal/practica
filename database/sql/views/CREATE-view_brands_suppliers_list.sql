CREATE OR REPLACE VIEW view_brands_suppliers_list AS
SELECT s.id, s.name
FROM suppliers s
WHERE s.id IN(
	SELECT DISTINCT supplier_id
	FROM view_brands
);