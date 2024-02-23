CREATE OR REPLACE VIEW view_brands_purchase_create AS
SELECT b.id, b.name, b.supplier_id
FROM brands b
WHERE b.id IN(
    SELECT vp.brand_id
    FROM view_products vp
    GROUP BY vp.brand_id
);
