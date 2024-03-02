CREATE OR REPLACE  VIEW view_products_categories AS 
    SELECT 
        vc.id , 
        vc.name  
    FROM 
        view_categories AS vc 
    WHERE  VC.id IN (SELECT DISTINCT vp.category_id FROM view_products AS vp)