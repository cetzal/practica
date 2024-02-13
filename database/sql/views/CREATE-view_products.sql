CREATE OR REPLACE VIEW view_products AS
select
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
    b.name AS brand_name,
    c.name AS category_name,
    ut.unit_name AS unit_name,
    concat(u.name, ' ', u.last_name) AS asuser_name
from
   pruebas.products p
inner join pruebas.units ut on p.unit_id = ut.id
inner join pruebas.categories c on p.category_id = c.id
inner join pruebas.brands b on p.brand_id = b.id
inner join pruebas.users u on p.user_id = u.id
where p.deleted_at is null;