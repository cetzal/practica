CREATE OR REPLACE VIEW view_products_suppliers_edit AS
SELECT s.id, s.name, s.is_active
FROM suppliers s