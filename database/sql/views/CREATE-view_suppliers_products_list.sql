CREATE OR REPLACE VIEW view_suppliers_products_list AS
SELECT s.id, s.name
FROM suppliers s
WHERE s.id IN(
    SELECT vp.supplier_id
    FROM view_products vp
    GROUP BY vp.supplier_id
);