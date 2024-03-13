CREATE OR REPLACE VIEW view_purchase_status_list AS
SELECT 
DISTINCT 
vp.status as id,
(CASE vp.status
   when 0 then 'No pagado' 
   when 1 then 'Abonado' 
   when 2 then 'Pagado' END) as name
FROM view_purchases AS vp 
ORDER BY vp.status ASC 