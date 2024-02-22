CREATE OR REPLACE VIEW view_products_for_purchase AS
SELECT
    wp.id,
    wp.code,
    wp.name,
    wp.brand_id,
    wp.category_id,
    wp.type,
    wp.barcode_symbology,
    wp.unit_id,
    wp.purchase_unit_id,
    wp.sale_unit_id,
    wp.cost,
    wp.price,
    wp.qty,
    wp.alert_quantity,
    wp.promotion,
    wp.promotion_price,
    wp.starting_date,
    wp.last_date,
    wp.tax_id,
    wp.tax_method,
    wp.picture,
    wp.product_details,
    wp.supplier_id,
    wp.brand_name,
    wp.supplier_name,
    wp.category_name,
    wp.unit_name,
    wp.is_active
FROM view_products AS wp
WHERE wp.is_active = 1;

