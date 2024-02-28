CREATE OR REPLACE VIEW view_products_brands_edit AS
SELECT b.id, b.name, b.supplier_id, b.is_active
FROM brands b