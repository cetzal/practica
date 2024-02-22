CREATE OR REPLACE VIEW view_suppliers_sales_create AS
SELECT s.id, s.name
FROM suppliers s
WHERE s.id IN(
    SELECT vp.supplier_id
    FROM view_products vp
    WHERE vp.is_active = 1
    GROUP BY vp.supplier_id
);
