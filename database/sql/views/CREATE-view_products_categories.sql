CREATE OR REPLACE  VIEW view_products_categories AS 
SELECT
	category_id,
    category_name
FROM 
    view_products
GROUP BY category_id;