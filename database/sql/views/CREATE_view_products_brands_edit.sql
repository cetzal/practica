CREATE OR REPLACE VIEW view_products_brands_edit AS
SELECT b.id, b.name, b.supplier_id, (
        SELECT IF(s.is_active = 1 &&  b.is_active = 1, 1, 0) 
        FROM suppliers s 
        WHERE s.id = b.supplier_id
    ) as is_active
FROM brands b
WHERE b.supplier_id IS NOT NULL;