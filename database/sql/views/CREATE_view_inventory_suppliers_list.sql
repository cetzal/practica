CREATE OR REPLACE VIEW view_inventory_suppliers_list AS
SELECT vpsl.id, vpsl.name
FROM view_purchase_suppliers_list vpsl
UNION
SELECT vssl.id, vssl.name
FROM view_sales_suppliers_list vssl;