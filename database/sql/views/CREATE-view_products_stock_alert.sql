CREATE OR REPLACE VIEW view_products_stock_alert AS
SELECT id, name, brand_name, qty as stock_total, alert_quantity as stock_min
FROM view_products
WHERE alert_quantity >= qty AND supplier_id IS NOT NULL;