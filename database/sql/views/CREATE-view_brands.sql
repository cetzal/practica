CREATE OR REPLACE 
VIEW view_brands AS
SELECT
  b.id,
  b.name,
  b.description,
  b.is_active,
  u.id as user_id,
  u.name as user_name
FROM
   brands as b
INNER JOIN users u ON u.id = b.created_by
  where b.deleted_at is NULL;
  
 SELECT
  b.id,
  b.name,
  b.description,
  b.is_active
FROM
   brands as b
 where b.deleted_at is NULL ;