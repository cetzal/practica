CREATE OR REPLACE VIEW view_products AS
SELECT
    p.id AS id,
    p.code AS code,
    p.name AS name,
    p.brand_id AS brand_id,
    p.category_id AS category_id,
    p.type AS type,
    p.barcode_symbology AS barcode_symbology,
    p.unit_id AS unit_id,
    p.purchase_unit_id AS purchase_unit_id,
    p.sale_unit_id AS sale_unit_id,
    p.cost AS cost,
    p.price AS price,
    p.qty AS qty,
    p.alert_quantity AS alert_quantity,
    p.promotion AS promotion,
    p.promotion_price AS promotion_price,
    p.starting_date AS starting_date,
    p.last_date AS last_date,
    p.tax_id AS tax_id,
    p.tax_method AS tax_method,
    p.image AS picture,
    p.product_details AS product_details,
    p.is_active AS is_active,
    p.created_at,
    p.updated_at,
    p.deleted_at AS deleted_at,
    p.user_id AS user_id,
    b.supplier_id,
    b.name AS brand_name,
    (SELECT s.name FROM suppliers AS s WHERE s.id = b.supplier_id) AS supplier_name,
    (SELECT c.name FROM categories AS c WHERE c.id = p.category_id ) AS category_name,
    (SELECT ut.unit_name FROM units AS ut WHERE ut.id = p.unit_id) AS unit_name,
    (SELECT CONCAT(u.name, ' ', u.last_name) FROM users AS u WHERE u.id = p.user_id) AS asuser_name
FROM
   pruebas.products AS p
INNER JOIN brands AS b ON p.brand_id = b.id
WHERE p.deleted_at IS NULL;