CREATE OR REPLACE VIEW view_products_list AS
SELECT id, name, brand_id
FROM view_products
WHERE is_active = 1 AND qty > 0;