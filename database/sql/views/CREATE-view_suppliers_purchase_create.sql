CREATE OR REPLACE VIEW view_suppliers_purchase_create AS
SELECT s.id, s.name
FROM view_suppliers_active s
WHERE s.id IN(
    SELECT vp.supplier_id
    FROM view_products vp
    GROUP BY vp.supplier_id
);
