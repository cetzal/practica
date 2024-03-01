CREATE OR REPLACE VIEW view_purchase_product_search AS
SELECT
    vpa.id,
    vpa.code,
    vpa.name,
    vpa.brand_id,
    vpa.category_id,
    vpa.type,
    vpa.barcode_symbology,
    vpa.unit_id,
    vpa.purchase_unit_id,
    vpa.sale_unit_id,
    vpa.cost,
    vpa.price,
    vpa.qty,
    vpa.alert_quantity,
    vpa.promotion,
    vpa.promotion_price,
    vpa.starting_date,
    vpa.last_date,
    vpa.tax_id,
    vpa.tax_method,
    vpa.picture,
    vpa.product_details,
    vpa.supplier_id,
    vpa.brand_name,
    vpa.supplier_name,
    vpa.category_name,
    vpa.unit_name,
    vpa.is_active
FROM view_products_active AS vpa
WHERE vpa.brand_id in (SELECT vba.id FROM view_brands_active as vba)

