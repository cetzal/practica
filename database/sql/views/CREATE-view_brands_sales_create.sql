CREATE OR REPLACE VIEW view_brands_sales_create AS
SELECT b.id, b.name, b.supplier_id
FROM brands b
WHERE b.id IN(
    SELECT vp.brand_id
    FROM view_products vp
    WHERE vp.is_active = 1
    GROUP BY vp.brand_id
);
