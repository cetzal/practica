CREATE OR REPLACE VIEW view_inventory_brands_list AS
SELECT vpbl.id, vpbl.name, vpbl.supplier_id
FROM view_purchase_brands_list vpbl 
UNION
SELECT vsbl.id, vsbl.name, vsbl.supplier_id
FROM view_sales_brands_list vsbl;